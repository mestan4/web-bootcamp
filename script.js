// --- 1. ÇALIŞMA EKLEME FORMU (ADD-STUDY) ---
const studyForm = document.querySelector('form');
const lessonInput = document.getElementById('lesson-input');
const studyDate = document.getElementById('study-date');
const durationInput = document.getElementById('duration');
const topicInput = document.getElementById('study-topic');
const statusSelect = document.getElementById('status-select');

// Otomatik bugünün tarihini ver
if (studyDate) {
  studyDate.value = new Date().toISOString().split('T')[0];
}

if (studyForm && lessonInput) {
  studyForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const newRecord = {
      date: studyDate.value,
      lesson: lessonInput.value.trim(),
      topic: topicInput.value.trim(),
      duration: `${durationInput.value} dk`,
      status: statusSelect ? statusSelect.value : 'Tamamlandı'
    };

    const existingStudies = JSON.parse(localStorage.getItem('studies')) || [];
    existingStudies.push(newRecord);
    localStorage.setItem('studies', JSON.stringify(existingStudies));

    alert(`Tebrikler! "${newRecord.topic}" çalışması başarıyla kaydedildi.`);
    window.location.href = 'reports.html';
  });
}

// --- 2. RAPORLAR SAYFASI (REPORTS) DİNAMİK YÜKLEME & MATEMATİK HESABI ---
const reportTableBody = document.querySelector('.report-table tbody');

if (reportTableBody) {
  // 1. LocalStorage'da kayıtlı yeni çalışmaları tabloya ekle
  const savedStudies = JSON.parse(localStorage.getItem('studies')) || [];
  savedStudies.forEach(study => {
    const row = document.createElement('tr');
    
    // Duruma göre doğru rozet rengini seç
    let badgeClass = 'badge-waiting';
    if (study.status === 'Tamamlandı') badgeClass = 'badge-success';
    if (study.status === 'Devam Ediyor') badgeClass = 'badge-process';

    row.innerHTML = `
      <td>${study.date}</td>
      <td>${study.lesson}</td>
      <td>${study.topic}</td>
      <td>${study.duration}</td>
      <td><span class="table-badge ${badgeClass}">${study.status}</span></td>
    `;
    reportTableBody.appendChild(row);
  });

  // 2. Tablodaki TÜM Satırları Okuyup Matematiği Yeniden Hesapla
  const allRows = reportTableBody.querySelectorAll('tr');
  let totalMinutes = 0;
  let completedCount = 0;
  const totalTopics = allRows.length;

  allRows.forEach(row => {
    // 4. sütundaki süreyi al ("120 dk" -> 120 sayısına çevir)
    const durationText = row.children[3].textContent.trim();
    const minutesMatch = durationText.match(/\d+/);
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[0], 10);
    }

    // 5. sütundaki durumu kontrol et
    const statusText = row.children[4].textContent.trim();
    if (statusText === 'Tamamlandı') {
      completedCount++;
    }
  });

  // Toplam saati hesapla (1 ondalık basamaklı, örn: 5.5 Saat)
  const totalHours = (totalMinutes / 60).toFixed(1);
  const percent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Kartlara değerleri yaz
  const totalHoursEl = document.getElementById('stat-total-hours');
  const completedCountEl = document.getElementById('stat-completed-count');
  const progressPercentEl = document.getElementById('stat-progress-percent');

  if (totalHoursEl) totalHoursEl.textContent = `${totalHours} Saat`;
  if (completedCountEl) completedCountEl.textContent = `${completedCount} / ${totalTopics}`;
  if (progressPercentEl) progressPercentEl.textContent = `%${percent}`;
}