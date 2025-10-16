
import warnings
import logging
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import shap

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score
import joblib

# -----------------------------
# 0) Uyarılar ve Logging
# -----------------------------
warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# -----------------------------
# 1) Dataset Yükleme
# -----------------------------
CSV_PATH = "../data/learning_dataset_30v30_realistic.csv"
df = pd.read_csv(CSV_PATH)
logging.info(f"Dataset yüklendi: {df.shape[0]} kayıt, {df.shape[1]} sütun")

# -----------------------------
# 2) Efficiency sütunları
# -----------------------------
weighted_video = df["video_easy"]*0.5 + df["video_medium"]*1 + df["video_hard"]*1.5
weighted_text  = df["text_easy"]*0.5 + df["text_medium"]*1 + df["text_hard"]*1.5
avg_time_video = df["time_video"] / 30
avg_time_text  = df["time_text"] / 30
df["efficiency_video"] = weighted_video / (avg_time_video + 1e-5)
df["efficiency_text"]  = weighted_text  / (avg_time_text  + 1e-5)

# -----------------------------
# 3) Özellikler ve hedef
# -----------------------------
video_cols = [f"video_q{i+1}" for i in range(30)]
text_cols  = [f"text_q{i+1}" for i in range(30)]
extra_features = ["video_easy","video_medium","video_hard","text_easy","text_medium","text_hard",
                  "time_video","time_text","time_total","efficiency_video","efficiency_text"]
demographic_cols = ["age", "gender"]

if "preferred_method" not in df.columns:
    df["preferred_method"] = df.apply(
        lambda row: "video" if row[video_cols].sum() > row[text_cols].sum()
        else ("text" if row[text_cols].sum() > row[video_cols].sum() else "equal"),
        axis=1
    )

feature_cols = demographic_cols + video_cols + text_cols + extra_features
X = df[feature_cols]
y = df["preferred_method"]

# Label encode
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# -----------------------------
# 4) Eğitim / Test Bölme
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# -----------------------------
# 5) Ön İşleme
# -----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["gender"]),
        ("num", "passthrough", [col for col in X.columns if col != "gender"])
    ]
)

# -----------------------------
# 6) Modeller
# -----------------------------
pipelines = {
    "LogisticRegression": Pipeline([("prep", preprocessor), ("clf", LogisticRegression(max_iter=1000, random_state=42))]),
    "DecisionTree": Pipeline([("prep", preprocessor), ("clf", DecisionTreeClassifier(random_state=42))]),
    "RandomForest": Pipeline([("prep", preprocessor), ("clf", RandomForestClassifier(random_state=42))]),
    "SVM": Pipeline([("prep", preprocessor), ("clf", SVC(probability=True, random_state=42))]),
    "XGBoost": Pipeline([("prep", preprocessor), ("clf", XGBClassifier(use_label_encoder=False, eval_metric="mlogloss", random_state=42))])
}

param_grids = {
    "LogisticRegression": {"clf__C": [0.1, 1.0, 10]},
    "DecisionTree": {"clf__max_depth": [None, 10, 20], "clf__min_samples_split": [2,5]},
    "RandomForest": {"clf__n_estimators": [200], "clf__max_depth": [10,20], "clf__min_samples_split": [2,5]},
    "SVM": {"clf__C": [0.1,1,10], "clf__kernel":["linear","rbf"]},
    "XGBoost": {"clf__n_estimators":[200], "clf__max_depth":[5,7], "clf__learning_rate":[0.05,0.1]}
}

# -----------------------------
# 7) GridSearch + CV
# -----------------------------
best_models = {}
acc_scores = {}
f1_scores = {}

for name, pipe in pipelines.items():
    logging.info(f"{name} için GridSearch başlatılıyor...")
    gs = GridSearchCV(pipe, param_grids[name], scoring="f1_macro",
                      cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42), n_jobs=-1)
    gs.fit(X_train, y_train)
    best_models[name] = gs.best_estimator_
    preds = gs.predict(X_test)
    acc_scores[name] = accuracy_score(y_test, preds)
    f1_scores[name] = f1_score(y_test, preds, average="macro")
    logging.info(f"{name} -> En iyi parametreler: {gs.best_params_} | Accuracy: {acc_scores[name]:.3f} | Macro-F1: {f1_scores[name]:.3f}")

# -----------------------------
# 8) Skorları Tek Grafikte Göster
# -----------------------------
plt.figure(figsize=(10,5))
x = np.arange(len(best_models))
width = 0.35
plt.bar(x - width/2, [acc_scores[m] for m in best_models], width, label="Accuracy", color="skyblue")
plt.bar(x + width/2, [f1_scores[m] for m in best_models], width, label="Macro-F1", color="orange")
plt.xticks(x, list(best_models.keys()))
plt.ylabel("Skor")
plt.title("Tüm Modellerin Accuracy ve Macro-F1 Karşılaştırması")
plt.legend()
plt.tight_layout()
plt.show()

# -----------------------------
# 9) En İyi Modeli Kaydet
# -----------------------------
best_name = max(f1_scores, key=f1_scores.get)
best_model = best_models[best_name]
MODEL_PATH = Path("../data/best_learning_model_full_summary.joblib")
joblib.dump(best_model, MODEL_PATH)
logging.info(f"✅ En iyi model: {best_name} | F1: {f1_scores[best_name]:.3f}")
logging.info(f"Model kaydedildi: {MODEL_PATH.resolve()}")
