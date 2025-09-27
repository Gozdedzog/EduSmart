reimport warnings
import logging
from pathlib import Path

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
import joblib

# -----------------------------
# 0) Uyarılar ve logging
# -----------------------------
warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# -----------------------------
# 1) Dataset yükle
# -----------------------------
CSV_PATH = "learning_dataset_30v30_realistic.csv"
df = pd.read_csv(CSV_PATH)
logging.info(f"Dataset yüklenildi: {df.shape[0]} kayıt, {df.shape[1]} sütun")

# -----------------------------
# 2) Hedef sütun kontrolü ve oluşturma
# -----------------------------
video_cols = [f"video_q{i+1}" for i in range(30)]
text_cols  = [f"text_q{i+1}" for i in range(30)]

if "preferred_method" not in df.columns:
    df["preferred_method"] = df.apply(
        lambda row: "video" if row[video_cols].sum() > row[text_cols].sum()
                    else ("text" if row[text_cols].sum() > row[video_cols].sum() else "equal"),
        axis=1
    )
logging.info("preferred_method sütunu hazır.")

# -----------------------------
# 3) Özellikler ve hedef değişken
# -----------------------------
demographic_cols = ["age", "gender"]
question_cols = video_cols + text_cols
X = df[demographic_cols + question_cols]
y = df["preferred_method"]

# LabelEncoder ile sayısal hedef
le = LabelEncoder()
y_encoded = le.fit_transform(y)
logging.info(f"Classes: {list(le.classes_)}")

# -----------------------------
# 4) Eğitim/test seti
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
logging.info(f"Eğitim seti: {X_train.shape[0]}, Test seti: {X_test.shape[0]}")

# -----------------------------
# 5) Ön işleme pipeline
# -----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["gender"]),
        ("num", "passthrough", ["age"] + question_cols)
    ]
)

# -----------------------------
# 6) Modeller ve parametreler
# -----------------------------
pipelines = {
    "LogisticRegression": Pipeline([
        ("prep", preprocessor),
        ("clf", LogisticRegression(max_iter=1000))
    ]),
    "DecisionTree": Pipeline([
        ("prep", preprocessor),
        ("clf", DecisionTreeClassifier(random_state=42))
    ]),
    "RandomForest": Pipeline([
        ("prep", preprocessor),
        ("clf", RandomForestClassifier(random_state=42))
    ]),
    "SVM": Pipeline([
        ("prep", preprocessor),
        ("clf", SVC(probability=True, random_state=42))
    ]),
    "XGBoost": Pipeline([
        ("prep", preprocessor),
        ("clf", XGBClassifier(use_label_encoder=False, eval_metric="mlogloss", random_state=42))
    ])
}

param_grids = {
    "LogisticRegression": {"clf__C": [0.1, 1.0, 10], "clf__solver": ["lbfgs", "saga"]},
    "DecisionTree": {"clf__max_depth": [None, 10, 20], "clf__min_samples_split": [2, 5]},
    "RandomForest": {"clf__n_estimators": [200, 300], "clf__max_depth": [None, 10, 20], "clf__min_samples_split": [2, 5]},
    "SVM": {"clf__C": [0.1, 1, 10], "clf__kernel": ["linear", "rbf"]},
    "XGBoost": {"clf__n_estimators": [100, 200], "clf__max_depth": [3, 5, 7], "clf__learning_rate": [0.05, 0.1, 0.2]}
}

# -----------------------------
# 7) GridSearch + CV
# -----------------------------
best_models = {}
for name in pipelines:
    logging.info(f"{name} için GridSearchCV başlatılıyor...")
    gs = GridSearchCV(
        estimator=pipelines[name],
        param_grid=param_grids[name],
        scoring="f1_macro",
        cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
        n_jobs=-1
    )
    gs.fit(X_train, y_train)
    logging.info(f"{name} en iyi parametreler: {gs.best_params_}")
    best_models[name] = gs.best_estimator_

# -----------------------------
# 8) Test setinde değerlendirme
# -----------------------------
def evaluate_model(name, model):
    preds = model.predict(X_test)
    preds_labels = le.inverse_transform(preds)
    y_test_labels = le.inverse_transform(y_test)
    
    acc = accuracy_score(y_test_labels, preds_labels)
    f1m = f1_score(y_test_labels, preds_labels, average="macro")
    logging.info(f"[{name}] Accuracy: {acc:.3f} | Macro-F1: {f1m:.3f}")
    logging.info(f"\n{classification_report(y_test_labels, preds_labels)}")
    logging.info(f"Confusion matrix:\n{confusion_matrix(y_test_labels, preds_labels)}\n")
    return f1m, model

f1_scores = {}
for name, model in best_models.items():
    f1, _ = evaluate_model(name, model)
    f1_scores[name] = f1

# -----------------------------
# 9) En iyi modeli kaydet
# -----------------------------
best_name = max(f1_scores, key=f1_scores.get)
best_model = best_models[best_name]
MODEL_PATH = Path("best_learning_model_optimized.joblib")
joblib.dump(best_model, MODEL_PATH)
logging.info(f"En iyi model: {best_name}")
logging.info(f"Model kaydedildi: {MODEL_PATH.resolve()}")

# -----------------------------
# 10) Örnek tahmin
# -----------------------------
sample = X_test.iloc[[0]]
pred = best_model.predict(sample)[0]
pred_label = le.inverse_transform([pred])[0]
proba = best_model.predict_proba(sample)[0]
classes = le.inverse_transform(best_model.named_steps["clf"].classes_)
prob_table = dict(zip(classes, proba))

logging.info(f"Örnek kayıt için tahmin: {pred_label}")
logging.info(f"Sınıf olasılıkları: {prob_table}")

# -----------------------------
# 11) Overfitting Kontrolü
# -----------------------------
from sklearn.model_selection import cross_val_score

logging.info("\n=== OVERFITTING KONTROLÜ ===")

# Cross-validation ile overfitting kontrolü
cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='accuracy')
logging.info(f"Cross-validation scores: {cv_scores}")
logging.info(f"Mean CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

# Train vs Test accuracy
train_pred = best_model.predict(X_train)
train_acc = accuracy_score(y_train, train_pred)
test_pred = best_model.predict(X_test)
test_acc = accuracy_score(y_test, test_pred)

logging.info(f"Train accuracy: {train_acc:.3f}")
logging.info(f"Test accuracy: {test_acc:.3f}")
logging.info(f"Overfitting gap: {train_acc - test_acc:.3f}")

if train_acc - test_acc > 0.05:
    logging.warning("⚠️  OVERFITTING RİSKİ VAR!")
elif train_acc - test_acc > 0.02:
    logging.info("⚠️  Hafif overfitting riski")
else:
    logging.info("✅ Overfitting riski düşük")

# Sınıf dağılımı analizi
logging.info(f"\n=== SINIF DAĞILIMI ANALİZİ ===")
logging.info(f"Train set sınıf dağılımı: {pd.Series(y_train).value_counts().to_dict()}")
logging.info(f"Test set sınıf dağılımı: {pd.Series(y_test).value_counts().to_dict()}")

# Veri seti kalitesi
logging.info(f"\n=== VERİ SETİ KALİTESİ ===")
video_cols = [f"video_q{i+1}" for i in range(30)]
text_cols = [f"text_q{i+1}" for i in range(30)]
df_temp = pd.read_csv(CSV_PATH)
df_temp["video_total"] = df_temp[video_cols].sum(axis=1)
df_temp["text_total"] = df_temp[text_cols].sum(axis=1)
df_temp["score_diff"] = df_temp["video_total"] - df_temp["text_total"]

logging.info(f"Ortalama skor farkı: {df_temp['score_diff'].mean():.2f}")
logging.info(f"Skor farkı std: {df_temp['score_diff'].std():.2f}")
close_scores = len(df_temp[abs(df_temp['score_diff']) <= 2])
logging.info(f"Çok yakın skorlar (≤2 fark): {close_scores} ({close_scores/len(df_temp)*100:.1f}%)")

if close_scores / len(df_temp) > 0.5:
    logging.info("✅ Yüksek belirsizlik - gerçekçi veri seti")
else:
    logging.info("⚠️  Düşük belirsizlik - yapay veri seti")