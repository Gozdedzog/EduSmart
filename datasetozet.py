# filename: analyze_dataset.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === 1) Dataseti yükle === #
df = pd.read_csv("learning_dataset_30v30_realistic.csv")

# === 2) Ön hazırlık: Toplam skorlar ve sayısallaştırma === #
# Toplam skorlar
df["video_total"] = df[[f"video_q{i}" for i in range(1, 31)]].sum(axis=1)
df["text_total"]  = df[[f"text_q{i}"  for i in range(1, 31)]].sum(axis=1)

# Cinsiyeti sayısallaştır (M=1, F=0)
df["gender_num"] = df["gender"].map({"M": 1, "F": 0})

# === 3) Genel Özet === #
print("\n=== Genel Bilgi ===")
print(df.info())

print("\n=== İlk 5 Satır ===")
print(df.head())

print("\n=== Sayısal Değişkenlerin Özeti ===")
print(df.describe())

print("\n=== Kategorik Değişkenlerin Dağılımı ===")
print(df["gender"].value_counts())
print(df["preferred_method"].value_counts())

# === 4) Ortalama Başarılar === #
print("\n=== Ortalama Başarılar ===")
print("Video sorularında ortalama başarı:", df["video_total"].mean())
print("Yazı sorularında ortalama başarı:", df["text_total"].mean())


# === 6) Tercihlere Göre Dağılımlar === #
plt.figure(figsize=(6,4))
sns.countplot(data=df, x="preferred_method", palette="Set2")
plt.title("Öğrenme Tercihi Dağılımı")
plt.show()

plt.figure(figsize=(6,4))
sns.countplot(data=df, x="gender", hue="preferred_method", palette="pastel")
plt.title("Cinsiyete Göre Öğrenme Tercihi")
plt.show()

# === 7) Yaşa Göre Başarı === #
plt.figure(figsize=(6,4))
sns.boxplot(data=df, x="age", y="video_total", palette="Blues")
plt.title("Yaşa Göre Video Başarı Dağılımı")
plt.show()

plt.figure(figsize=(6,4))
sns.boxplot(data=df, x="age", y="text_total", palette="Greens")
plt.title("Yaşa Göre Yazı Başarı Dağılımı")
plt.show()

# === 8) Özet değişkenler korelasyonu === #
summary_vars = ["age", "gender_num", "video_total", "text_total"]
corr_summary = df[summary_vars].corr()

plt.figure(figsize=(6,4))
sns.heatmap(corr_summary, annot=True, fmt=".2f", cmap="coolwarm", cbar=True)
plt.title("Özet Değişkenler Korelasyon Matrisi")
plt.tight_layout()
plt.show()

# === 9) Ek bilgi === #
print("\n=== Özet Bilgiler ===")
print(df[summary_vars].describe())
