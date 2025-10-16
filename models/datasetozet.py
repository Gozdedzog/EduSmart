import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === 1) Dataseti yükle === #
df = pd.read_csv("../data/learning_dataset_30v30_realistic.csv")

# Eğer datasette efficiency sütunları yoksa oluştur
if "efficiency_video" not in df.columns or "efficiency_text" not in df.columns:
    # Weighted skor hesaplamaları (zorluk katsayısı)
    weighted_video = df["video_easy"]*0.5 + df["video_medium"]*1 + df["video_hard"]*1.5
    weighted_text  = df["text_easy"]*0.5 + df["text_medium"]*1 + df["text_hard"]*1.5
    avg_time_video = df["time_video"] / 30
    avg_time_text  = df["time_text"] / 30
    df["efficiency_video"] = weighted_video / (avg_time_video + 1e-5)
    df["efficiency_text"]  = weighted_text  / (avg_time_text  + 1e-5)

# === 2) Ön hazırlık: Cinsiyeti sayısallaştır === #
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
print("Text sorularında ortalama başarı:", df["text_total"].mean())
print("Video Efficiency ortalama:", df["efficiency_video"].mean())
print("Text Efficiency ortalama:", df["efficiency_text"].mean())

# === 5) Tercihlere Göre Dağılımlar === #
plt.figure(figsize=(6,4))
sns.countplot(data=df, x="preferred_method", palette="Set2")
plt.title("Öğrenme Tercihi Dağılımı")
plt.show()

plt.figure(figsize=(6,4))
sns.countplot(data=df, x="gender", hue="preferred_method", palette="pastel")
plt.title("Cinsiyete Göre Öğrenme Tercihi")
plt.show()

# === 6) Yaşa Göre Başarı === #
plt.figure(figsize=(6,4))
sns.boxplot(data=df, x="age", y="video_total", palette="Blues")
plt.title("Yaşa Göre Video Başarı Dağılımı")
plt.show()

plt.figure(figsize=(6,4))
sns.boxplot(data=df, x="age", y="text_total", palette="Greens")
plt.title("Yaşa Göre Text Başarı Dağılımı")
plt.show()

# === 7) Kolay-Orta-Zor Dağılımları === #
plt.figure(figsize=(8,5))
sns.boxplot(data=df[["video_easy","video_medium","video_hard"]])
plt.title("Video Sorularında Kolay-Orta-Zor Başarı Dağılımı")
plt.ylabel("Doğru Sayısı")
plt.show()

plt.figure(figsize=(8,5))
sns.boxplot(data=df[["text_easy","text_medium","text_hard"]])
plt.title("Text Sorularında Kolay-Orta-Zor Başarı Dağılımı")
plt.ylabel("Doğru Sayısı")
plt.show()

# === 8) Süre Dağılımları === #
plt.figure(figsize=(6,4))
sns.histplot(df["time_video"], bins=30, kde=True, color="skyblue")
plt.title("Video Süre Dağılımı")
plt.xlabel("Süre (sn)")
plt.show()

plt.figure(figsize=(6,4))
sns.histplot(df["time_text"], bins=30, kde=True, color="lightgreen")
plt.title("Text Süre Dağılımı")
plt.xlabel("Süre (sn)")
plt.show()

# === 9) Efficiency Dağılımları === #
plt.figure(figsize=(6,4))
sns.kdeplot(df["efficiency_video"], shade=True, color="blue", label="Video")
sns.kdeplot(df["efficiency_text"], shade=True, color="green", label="Text")
plt.title("Efficiency Dağılımı (Doğru / Süre)")
plt.legend()
plt.show()

# === 10) Korelasyon Analizi === #
summary_vars = [
    "age", "gender_num",
    "video_total", "text_total",
    "video_easy", "video_medium", "video_hard",
    "text_easy", "text_medium", "text_hard",
    "time_video", "time_text", "efficiency_video", "efficiency_text"
]

corr_summary = df[summary_vars].corr()

plt.figure(figsize=(10,8))
sns.heatmap(corr_summary, annot=False, cmap="coolwarm", cbar=True)
plt.title("Özet Değişkenler Korelasyon Matrisi")
plt.tight_layout()
plt.show()

# === 11) Ek bilgi === #
print("\n=== Özet Bilgiler ===")
print(df[summary_vars].describe())