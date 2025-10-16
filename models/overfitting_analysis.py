#!/usr/bin/env python3
"""
Overfitting Analizi - Model Performans Değerlendirmesi
Bu script modelin overfitting riskini analiz eder.
"""

import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, learning_curve
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report
import warnings

warnings.filterwarnings("ignore")

# -----------------------------------------------------------------------------
# 1. Veri Yükleme ve Hazırlık
# -----------------------------------------------------------------------------
print("📊 Overfitting Analizi Başlatılıyor...")
print("=" * 50)

# Dataset yükle
df = pd.read_csv("../data/learning_dataset_30v30_realistic.csv")
print(f"Dataset boyutu: {df.shape}")

# Özellikler
video_cols = [f"video_q{i+1}" for i in range(30)]
text_cols = [f"text_q{i+1}" for i in range(30)]
extra_features = [
    "video_easy", "video_medium", "video_hard",
    "text_easy", "text_medium", "text_hard",
    "time_video", "time_text", "time_total",
    "efficiency_video", "efficiency_text"
]
demographic_cols = ["age", "gender"]

# Efficiency sütunları yoksa oluştur
if "efficiency_video" not in df.columns or "efficiency_text" not in df.columns:
    weighted_video = df["video_easy"]*0.5 + df["video_medium"]*1 + df["video_hard"]*1.5
    weighted_text = df["text_easy"]*0.5 + df["text_medium"]*1 + df["text_hard"]*1.5
    avg_time_video = df["time_video"] / 30
    avg_time_text = df["time_text"] / 30
    df["efficiency_video"] = weighted_video / (avg_time_video + 1e-5)
    df["efficiency_text"] = weighted_text / (avg_time_text + 1e-5)

# Hedef değişken
if "preferred_method" not in df.columns:
    df["preferred_method"] = df.apply(
        lambda row: "video" if row[video_cols].sum() > row[text_cols].sum()
        else ("text" if row[text_cols].sum() > row[video_cols].sum() else "equal"),
        axis=1
    )

# Özellikler ve hedef
feature_cols = demographic_cols + video_cols + text_cols + extra_features
X = df[feature_cols]
y = df["preferred_method"]

# Label encode
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"Eğitim seti: {X_train.shape[0]}, Test seti: {X_test.shape[0]}")

# -----------------------------------------------------------------------------
# 2. Model Tanımları
# -----------------------------------------------------------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["gender"]),
        ("num", "passthrough", [col for col in X.columns if col != "gender"])
    ]
)

models = {
    "LogisticRegression": Pipeline([
        ("prep", preprocessor), 
        ("clf", LogisticRegression(max_iter=2000, random_state=42))
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

# -----------------------------------------------------------------------------
# 3. Overfitting Analizi
# -----------------------------------------------------------------------------
print("\n🔍 OVERFITTING ANALİZİ")
print("=" * 30)

results = {}

for name, model in models.items():
    print(f"\n📈 {name} Analizi:")
    
    # Model eğitimi
    model.fit(X_train, y_train)
    
    # Train ve test performansları
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)
    
    train_acc = accuracy_score(y_train, train_pred)
    test_acc = accuracy_score(y_test, test_pred)
    train_f1 = f1_score(y_train, train_pred, average="macro")
    test_f1 = f1_score(y_test, test_pred, average="macro")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    cv_f1_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1_macro')
    
    # Performans farkları
    acc_gap = train_acc - test_acc
    f1_gap = train_f1 - test_f1
    
    results[name] = {
        'train_acc': train_acc,
        'test_acc': test_acc,
        'train_f1': train_f1,
        'test_f1': test_f1,
        'cv_acc_mean': cv_scores.mean(),
        'cv_acc_std': cv_scores.std(),
        'cv_f1_mean': cv_f1_scores.mean(),
        'cv_f1_std': cv_f1_scores.std(),
        'acc_gap': acc_gap,
        'f1_gap': f1_gap
    }
    
    print(f"  Train Accuracy: {train_acc:.3f}")
    print(f"  Test Accuracy:  {test_acc:.3f}")
    print(f"  CV Accuracy:    {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    print(f"  Accuracy Gap:  {acc_gap:.3f}")
    print(f"  Train F1:       {train_f1:.3f}")
    print(f"  Test F1:        {test_f1:.3f}")
    print(f"  CV F1:          {cv_f1_scores.mean():.3f} ± {cv_f1_scores.std():.3f}")
    print(f"  F1 Gap:         {f1_gap:.3f}")
    
    # Overfitting riski değerlendirmesi
    if acc_gap > 0.1:
        print("  ⚠️  YÜKSEK OVERFITTING RİSKİ!")
    elif acc_gap > 0.05:
        print("  ⚠️  ORTA OVERFITTING RİSKİ")
    else:
        print("  ✅ DÜŞÜK OVERFITTING RİSKİ")

# -----------------------------------------------------------------------------
# 4. Sonuç Özeti
# -----------------------------------------------------------------------------
print("\n📊 OVERFITTING RİSKİ ÖZETİ")
print("=" * 40)

# En iyi performanslı modeli bul
best_model = max(results.keys(), key=lambda x: results[x]['test_acc'])
print(f"🏆 En İyi Model: {best_model}")
print(f"   Test Accuracy: {results[best_model]['test_acc']:.3f}")
print(f"   Test F1: {results[best_model]['test_f1']:.3f}")

# Overfitting riski sıralaması
print("\n📈 Overfitting Risk Sıralaması (Accuracy Gap'e göre):")
sorted_models = sorted(results.items(), key=lambda x: x[1]['acc_gap'], reverse=True)
for i, (name, metrics) in enumerate(sorted_models, 1):
    risk_level = "YÜKSEK" if metrics['acc_gap'] > 0.1 else "ORTA" if metrics['acc_gap'] > 0.05 else "DÜŞÜK"
    print(f"  {i}. {name}: {metrics['acc_gap']:.3f} ({risk_level})")

# -----------------------------------------------------------------------------
# 5. Görselleştirme
# -----------------------------------------------------------------------------
print("\n📊 Görselleştirmeler oluşturuluyor...")

# Performans karşılaştırması
fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# Train vs Test Accuracy
models_names = list(results.keys())
train_accs = [results[name]['train_acc'] for name in models_names]
test_accs = [results[name]['test_acc'] for name in models_names]

axes[0,0].bar(models_names, train_accs, alpha=0.7, label='Train', color='skyblue')
axes[0,0].bar(models_names, test_accs, alpha=0.7, label='Test', color='lightcoral')
axes[0,0].set_title('Train vs Test Accuracy')
axes[0,0].set_ylabel('Accuracy')
axes[0,0].legend()
axes[0,0].tick_params(axis='x', rotation=45)

# Accuracy Gap
acc_gaps = [results[name]['acc_gap'] for name in models_names]
colors = ['red' if gap > 0.1 else 'orange' if gap > 0.05 else 'green' for gap in acc_gaps]
axes[0,1].bar(models_names, acc_gaps, color=colors, alpha=0.7)
axes[0,1].set_title('Overfitting Risk (Accuracy Gap)')
axes[0,1].set_ylabel('Train - Test Accuracy')
axes[0,1].axhline(y=0.05, color='orange', linestyle='--', alpha=0.7, label='Orta Risk')
axes[0,1].axhline(y=0.1, color='red', linestyle='--', alpha=0.7, label='Yüksek Risk')
axes[0,1].legend()
axes[0,1].tick_params(axis='x', rotation=45)

# CV Scores
cv_means = [results[name]['cv_acc_mean'] for name in models_names]
cv_stds = [results[name]['cv_acc_std'] for name in models_names]
axes[1,0].bar(models_names, cv_means, yerr=cv_stds, capsize=5, alpha=0.7, color='lightgreen')
axes[1,0].set_title('Cross-Validation Accuracy')
axes[1,0].set_ylabel('CV Accuracy')
axes[1,0].tick_params(axis='x', rotation=45)

# F1 Scores
train_f1s = [results[name]['train_f1'] for name in models_names]
test_f1s = [results[name]['test_f1'] for name in models_names]
axes[1,1].bar(models_names, train_f1s, alpha=0.7, label='Train F1', color='skyblue')
axes[1,1].bar(models_names, test_f1s, alpha=0.7, label='Test F1', color='lightcoral')
axes[1,1].set_title('Train vs Test F1 Score')
axes[1,1].set_ylabel('F1 Score')
axes[1,1].legend()
axes[1,1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig('overfitting_analysis.png', dpi=300, bbox_inches='tight')
plt.show()

# -----------------------------------------------------------------------------
# 6. Öneriler
# -----------------------------------------------------------------------------
print("\n💡 ÖNERİLER")
print("=" * 20)

high_risk_models = [name for name, metrics in results.items() if metrics['acc_gap'] > 0.1]
if high_risk_models:
    print(f"⚠️  Yüksek overfitting riski olan modeller: {', '.join(high_risk_models)}")
    print("   Öneriler:")
    print("   - Daha fazla veri toplayın")
    print("   - Regularization parametrelerini artırın")
    print("   - Model karmaşıklığını azaltın")
    print("   - Early stopping kullanın")

medium_risk_models = [name for name, metrics in results.items() if 0.05 < metrics['acc_gap'] <= 0.1]
if medium_risk_models:
    print(f"⚠️  Orta overfitting riski olan modeller: {', '.join(medium_risk_models)}")
    print("   Öneriler:")
    print("   - Cross-validation sonuçlarını takip edin")
    print("   - Validation set kullanın")

low_risk_models = [name for name, metrics in results.items() if metrics['acc_gap'] <= 0.05]
if low_risk_models:
    print(f"✅ Düşük overfitting riski olan modeller: {', '.join(low_risk_models)}")
    print("   Bu modeller güvenilir performans gösteriyor.")

print(f"\n🎯 Genel Değerlendirme:")
print(f"   En güvenilir model: {best_model}")
print(f"   Test performansı: {results[best_model]['test_acc']:.3f}")
print(f"   Overfitting riski: {'DÜŞÜK' if results[best_model]['acc_gap'] <= 0.05 else 'ORTA' if results[best_model]['acc_gap'] <= 0.1 else 'YÜKSEK'}")

print("\n✅ Overfitting analizi tamamlandı!")
