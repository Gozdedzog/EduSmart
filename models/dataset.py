
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# -----------------------------
# Sabitler ve Ayarlar
# -----------------------------
np.random.seed(42)  # Tekrar üretilebilirlik
n_students = 1000    # Öğrenci sayısı
n_questions = 30     # Soru sayısı

# Ortalama süreler (sn)
video_base_time = 42
text_base_time  = 33

# Başarı oranları
video_success_prob = 0.58
text_success_prob  = 0.56

# Epsilon (equal toleransı)
epsilon = 0.5

# -----------------------------
# 1. Demografik Bilgiler
# -----------------------------
ages = np.random.randint(17, 21, n_students)
genders = np.random.choice(["F", "M"], n_students)

# -----------------------------
# 2. Soruların Doğrulukları (Binary)
# -----------------------------
video_answers = np.random.binomial(1, video_success_prob, (n_students, n_questions))
text_answers  = np.random.binomial(1, text_success_prob, (n_students, n_questions))

# -----------------------------
# 3. Süre Simülasyonu (sn)
# -----------------------------
video_times = np.random.normal(loc=video_base_time, scale=7, size=(n_students, n_questions))
text_times  = np.random.normal(loc=text_base_time,  scale=7, size=(n_students, n_questions))

# Minimum süre 5 sn olacak şekilde clipping
video_times = np.clip(video_times, 5, None)
text_times  = np.clip(text_times, 5, None)

time_video_total = video_times.sum(axis=1)
time_text_total  = text_times.sum(axis=1)
time_total       = time_video_total + time_text_total

# -----------------------------
# 4. DataFrame Oluşturma
# -----------------------------
df = pd.DataFrame({
    "age": ages,
    "gender": genders,
    "time_video": time_video_total,
    "time_text": time_text_total,
    "time_total": time_total
})

# Video sorularını ekle
for i in range(n_questions):
    df[f"video_q{i+1}"] = video_answers[:, i]

# Text sorularını ekle
for i in range(n_questions):
    df[f"text_q{i+1}"] = text_answers[:, i]

# -----------------------------
# 5. Kolay / Orta / Zor Doğru Sayıları
# -----------------------------
df["video_easy"]   = df[[f"video_q{i}" for i in range(1, 11)]].sum(axis=1)
df["video_medium"] = df[[f"video_q{i}" for i in range(11, 21)]].sum(axis=1)
df["video_hard"]   = df[[f"video_q{i}" for i in range(21, 31)]].sum(axis=1)

df["text_easy"]   = df[[f"text_q{i}" for i in range(1, 11)]].sum(axis=1)
df["text_medium"] = df[[f"text_q{i}" for i in range(11, 21)]].sum(axis=1)
df["text_hard"]   = df[[f"text_q{i}" for i in range(21, 31)]].sum(axis=1)

# -----------------------------
# 6. Toplam Skorlar
# -----------------------------
df["video_total"] = video_answers.sum(axis=1)
df["text_total"]  = text_answers.sum(axis=1)
df["score_diff"]  = df["video_total"] - df["text_total"]

# -----------------------------
# 7. Weighted Skor ve Verimlilik
# -----------------------------
weighted_video = df["video_easy"]*0.5 + df["video_medium"]*1 + df["video_hard"]*1.5
weighted_text  = df["text_easy"]*0.5 + df["text_medium"]*1 + df["text_hard"]*1.5

avg_time_video = df["time_video"] / n_questions
avg_time_text  = df["time_text"]  / n_questions

score_per_sec_video = weighted_video / (avg_time_video + 1e-5)
score_per_sec_text  = weighted_text  / (avg_time_text  + 1e-5)

score_video = 0.7 * weighted_video + 0.3 * score_per_sec_video
score_text  = 0.7 * weighted_text  + 0.3 * score_per_sec_text

# -----------------------------
# 8. Tercih Belirleme
# -----------------------------
df["preferred_method"] = np.where(
    np.abs(score_video - score_text) <= epsilon, "equal",
    np.where(score_video > score_text, "video", "text")
)

# -----------------------------
# 9. CSV Kaydetme
# -----------------------------
df.to_csv("../data/learning_dataset_30v30_realistic.csv", index=False)
print("Dataset kaydedildi: ../data/learning_dataset_30v30_realistic.csv")
print("Dataset boyutu:", df.shape)
print(df.head())

# -----------------------------
# 10. Görselleştirmeler
# -----------------------------
sns.set(style="whitegrid")

# Tercih dağılımı
plt.figure(figsize=(5,5))
pref_counts = df["preferred_method"].value_counts()
plt.pie(pref_counts, labels=pref_counts.index, autopct='%1.1f%%', startangle=90, colors=["skyblue","lightgreen","lightgrey"])
plt.title("Öğrenme Tercih Dağılımı")
plt.show()
print("\nTercih Sayıları:\n", pref_counts)

# Yaş dağılımı
plt.figure(figsize=(6,4))
sns.histplot(df["age"], bins=range(17,22), kde=False, color="salmon", edgecolor="black")
plt.title("Yaş Dağılımı")
plt.xlabel("Yaş")
plt.ylabel("Öğrenci Sayısı")
plt.show()

# Cinsiyet dağılımı
plt.figure(figsize=(5,4))
sns.countplot(x="gender", data=df, order=["F", "M"], palette={"F":"pink", "M":"lightblue"})
plt.title("Cinsiyet Dağılımı")
plt.show()

# Kolay-Orta-Zor Doğru Dağılımları (Video)
plt.figure(figsize=(8,5))
sns.boxplot(data=df[["video_easy","video_medium","video_hard"]])
plt.title("Video Sorularında Kolay-Orta-Zor Doğru Dağılımı")
plt.ylabel("Doğru Sayısı")
plt.show()

# Kolay-Orta-Zor Doğru Dağılımları (Text)
plt.figure(figsize=(8,5))
sns.boxplot(data=df[["text_easy","text_medium","text_hard"]])
plt.title("Text Sorularında Kolay-Orta-Zor Doğru Dağılımı")
plt.ylabel("Doğru Sayısı")
plt.show()

# Süre dağılımları
plt.figure(figsize=(6,4))
sns.histplot(df["time_video"], bins=30, color="skyblue", edgecolor="black")
plt.title("Video Sorularında Harcanan Süre")
plt.xlabel("Süre (sn)")
plt.ylabel("Öğrenci Sayısı")
plt.show()

plt.figure(figsize=(6,4))
sns.histplot(df["time_text"], bins=30, color="lightgreen", edgecolor="black")
plt.title("Text Sorularında Harcanan Süre")
plt.xlabel("Süre (sn)")
plt.ylabel("Öğrenci Sayısı")
plt.show()

# Zorluk seviyelerine göre ortalama doğru sayıları
labels = ["Kolay", "Orta", "Zor"]
avg_video = [df["video_easy"].mean(), df["video_medium"].mean(), df["video_hard"].mean()]
avg_text  = [df["text_easy"].mean(), df["text_medium"].mean(), df["text_hard"].mean()]

x = np.arange(len(labels))
plt.figure(figsize=(7,5))
plt.bar(x-0.2, avg_video, 0.4, label="Video", color="skyblue")
plt.bar(x+0.2, avg_text, 0.4, label="Text", color="lightgreen")
plt.xticks(x, labels)
plt.title("Zorluk Seviyelerine Göre Ortalama Doğru Sayısı")
plt.ylabel("Ortalama Doğru")
plt.legend()
plt.show()

# -----------------------------
# 11. Dakikaya Çevirme
# -----------------------------
df["time_video_min"] = df["time_video"] / 60
df["time_text_min"]  = df["time_text"] / 60
df["time_total_min"] = df["time_total"] / 60

df["avg_time_video_min"] = df["time_video_min"] / n_questions
df["avg_time_text_min"]  = df["time_text_min"] / n_questions

print("\nOrtalama Süreler:")
print(f"Video sorularına ortalama süre: {df['time_video_min'].mean():.2f} dk")
print(f"Text sorularına ortalama süre: {df['time_text_min'].mean():.2f} dk")
print(f"Toplam ortalama süre: {df['time_total_min'].mean():.2f} dk")
print(f"Soru başına ortalama video süresi: {df['avg_time_video_min'].mean():.2f} dk")
print(f"Soru başına ortalama text süresi: {df['avg_time_text_min'].mean():.2f} dk")

# Toplam süre dağılımı (dk)
plt.figure(figsize=(6,4))
sns.histplot(df["time_total_min"], bins=30, color="orange", edgecolor="black")
plt.title("Toplam Harcanan Süre Dağılımı (Dakika)")
plt.xlabel("Toplam Süre (dk)")
plt.ylabel("Öğrenci Sayısı")
plt.show()
