# filename: create_learning_dataset_realistic.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Rastgelelik için seed
np.random.seed(42)

n = 1000  # öğrenci sayısı

# === Demografik Bilgiler === #
ages = np.random.randint(17, 21, n)   # 17-20 yaş arası
genders = np.random.choice(["F", "M"], n)

# === Gerçekçi başarı oranları ile cevap üretimi === #
# Video sorularında başarı oranı %58
video_answers = np.random.binomial(1, 0.58, (n, 30))

# Yazı sorularında başarı oranı %56
text_answers  = np.random.binomial(1, 0.56, (n, 30))

# Doğru sayıları
video_total = video_answers.sum(axis=1)
text_total  = text_answers.sum(axis=1)

# === Öğrencinin Tercih Ettiği Yöntem === #
preferred_method = np.where(video_total > text_total, "video",
                     np.where(text_total > video_total, "text", "equal"))

# === DataFrame oluşturma === #
df = pd.DataFrame({
    "age": ages,
    "gender": genders,
})

# Video sorularını ekle
for i in range(30):
    df[f"video_q{i+1}"] = video_answers[:, i]

# Yazı sorularını ekle
for i in range(30):
    df[f"text_q{i+1}"] = text_answers[:, i]

# Toplam doğru sayıları ve tercih sütunu
df["video_total"] = video_total
df["text_total"]  = text_total
df["preferred_method"] = preferred_method

# === Dataset boyutu ve ilk satırlar === #
print("Dataset boyutu:", df.shape)
print(df.head())

# === CSV olarak kaydet === #
df.to_csv("learning_dataset_30v30_realistic.csv", index=False)

# === Görselleştirmeler === #

# Tercih dağılımı
pref_counts = df["preferred_method"].value_counts()
plt.figure(figsize=(5,5))
plt.pie(pref_counts, labels=pref_counts.index, autopct='%1.1f%%', startangle=90)
plt.title("Öğrenme Tercih Dağılımı")
plt.show()

# Yaş dağılımı
plt.figure(figsize=(6,4))
plt.hist(df["age"], bins=range(17,22), edgecolor="black")
plt.title("Yaş Dağılımı")
plt.xlabel("Yaş")
plt.ylabel("Kişi Sayısı")
plt.show()

# Cinsiyet dağılımı
gender_counts = df["gender"].value_counts()
plt.figure(figsize=(5,4))
plt.bar(gender_counts.index, gender_counts.values, color=["pink", "lightblue"])
plt.title("Cinsiyet Dağılımı")
plt.xlabel("Cinsiyet")
plt.ylabel("Kişi Sayısı")
plt.show()
