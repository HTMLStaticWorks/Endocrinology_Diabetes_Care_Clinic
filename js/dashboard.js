/**
 * ENDOCRINOLOGY & DIABETES CARE CLINIC - PATIENT DASHBOARD JS
 * Chart.js Telemetry, Interactive Glucose Log, Medication Checklist, Refill Workflows
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardNavigation();
  initDashboardMobileMenu();
  initGlucoseChart();
  initLabResultsChart();
  initBloodSugarLogger();
  initMedicationChecklist();
  initPrescriptionRefillModal();
  initReportDocumentViewer();
});

/* --------------------------------------------------------------------------
   DASHBOARD TAB NAVIGATION
   -------------------------------------------------------------------------- */
function initDashboardNavigation() {
  const navLinks = document.querySelectorAll('.dash-nav-link');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-tab');

      // Update active nav state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show target tab pane
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.getElementById('dashSidebar');
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   MOBILE OFFCANVAS SIDEBAR
   -------------------------------------------------------------------------- */
function initDashboardMobileMenu() {
  const mobileToggle = document.getElementById('dashMobileMenuBtn');
  const sidebar = document.getElementById('dashSidebar');
  const closeSidebarBtn = document.getElementById('dashSidebarCloseBtn');

  mobileToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  closeSidebarBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar?.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   CHART.JS: BLOOD GLUCOSE TELEMETRY TREND (24-Hour & 7-Day)
   -------------------------------------------------------------------------- */
let glucoseChartInstance = null;

function initGlucoseChart() {
  const ctx = document.getElementById('glucoseTrendChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const hours = ['12 AM', '3 AM', '6 AM', '8 AM (Bfast)', '10 AM', '1 PM (Lunch)', '4 PM', '7 PM (Dinner)', '10 PM', '11:59 PM'];
  const glucoseData = [105, 98, 92, 138, 115, 142, 110, 132, 118, 112];

  glucoseChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: 'Blood Glucose (mg/dL)',
          data: glucoseData,
          borderColor: '#A87986',
          backgroundColor: 'rgba(168, 121, 134, 0.12)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#25202A',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        },
        {
          label: 'Upper Target (140 mg/dL)',
          data: Array(hours.length).fill(140),
          borderColor: 'rgba(217, 130, 43, 0.4)',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Lower Target (70 mg/dL)',
          data: Array(hours.length).fill(70),
          borderColor: 'rgba(192, 77, 88, 0.4)',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
            color: '#292929'
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y} mg/dL`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 60,
          max: 180,
          grid: { color: 'rgba(37, 32, 42, 0.06)' },
          ticks: { color: '#626065', font: { family: "'Plus Jakarta Sans', sans-serif" } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#626065', font: { family: "'Plus Jakarta Sans', sans-serif" } }
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   CHART.JS: CLINICAL LAB RESULT TRENDS (HbA1c & TSH)
   -------------------------------------------------------------------------- */
function initLabResultsChart() {
  const ctx = document.getElementById('labTrendsChart');
  if (!ctx || typeof Chart === 'undefined') return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026', 'Sep 2026 (Latest)'],
      datasets: [
        {
          label: 'HbA1c (%)',
          data: [7.1, 6.6, 6.2, 5.9, 5.8],
          backgroundColor: '#25202A',
          borderRadius: 8,
          yAxisID: 'y'
        },
        {
          label: 'TSH (mIU/L)',
          data: [3.8, 2.9, 2.4, 2.2, 2.1],
          backgroundColor: '#AEB9AD',
          borderRadius: 8,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'HbA1c (%)', color: '#25202A' },
          min: 4,
          max: 9
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'TSH (mIU/L)', color: '#4A6B48' },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 6
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   INTERACTIVE BLOOD SUGAR LOGGER
   -------------------------------------------------------------------------- */
function initBloodSugarLogger() {
  const logForm = document.getElementById('logGlucoseForm');
  const historyTable = document.getElementById('glucoseHistoryTableBody');

  if (!logForm || !historyTable) return;

  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = document.getElementById('logGlucoseValue').value;
    const timing = document.getElementById('logGlucoseTiming').value;
    const notes = document.getElementById('logGlucoseNotes').value || 'Standard log';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let statusBadge = `<span class="status-badge-lab status-optimal">In Target</span>`;
    if (value > 140) statusBadge = `<span class="status-badge-lab status-review">Elevated</span>`;
    if (value < 70) statusBadge = `<span class="status-badge-lab status-borderline">Low</span>`;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><strong>${dateStr}, ${timeStr}</strong></td>
      <td><span class="badge bg-light text-dark border">${timing}</span></td>
      <td><strong style="color: #25202A;">${value} mg/dL</strong></td>
      <td>${statusBadge}</td>
      <td><small class="text-muted">${notes}</small></td>
    `;

    historyTable.prepend(newRow);

    // Update Quick Overview Stat
    const currentGlucoseStat = document.getElementById('statCurrentGlucose');
    if (currentGlucoseStat) {
      currentGlucoseStat.textContent = `${value} mg/dL`;
    }

    logForm.reset();
    alert(`Glucose reading (${value} mg/dL - ${timing}) successfully recorded to patient telemetry!`);
  });
}

/* --------------------------------------------------------------------------
   INTERACTIVE MEDICATION CHECKLIST
   -------------------------------------------------------------------------- */
function initMedicationChecklist() {
  const medRows = document.querySelectorAll('.med-item-row');
  const adherenceStat = document.getElementById('statMedicationCount');

  function updateAdherence() {
    const total = medRows.length;
    const taken = document.querySelectorAll('.med-item-row.taken').length;
    if (adherenceStat) {
      adherenceStat.textContent = `${taken} / ${total} Taken`;
    }
  }

  medRows.forEach(row => {
    const checkBtn = row.querySelector('.med-check-btn');
    checkBtn?.addEventListener('click', () => {
      row.classList.toggle('taken');
      if (row.classList.contains('taken')) {
        checkBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Taken`;
      } else {
        checkBtn.innerHTML = `<i class="bi bi-circle"></i> Log Dose`;
      }
      updateAdherence();
    });
  });
}

/* --------------------------------------------------------------------------
   PRESCRIPTION REFILL REQUEST WORKFLOW
   -------------------------------------------------------------------------- */
function initPrescriptionRefillModal() {
  const refillButtons = document.querySelectorAll('.btn-request-refill');

  refillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const medName = btn.getAttribute('data-med') || 'Medication';
      const pharmacy = prompt(`Request Refill for: ${medName}\nEnter Preferred Pharmacy (e.g. CVS Pharmacy - 4th St):`, 'CVS Pharmacy - Main Clinic Plaza');
      if (pharmacy) {
        alert(`Refill Request Submitted for ${medName}!\nRouting to Dr. Aris Thorne for electronic prescription transmission to ${pharmacy}. Estimated ready time: 24 hours.`);
        btn.textContent = 'Refill Pending';
        btn.classList.remove('btn-outline-plum');
        btn.classList.add('btn-secondary');
        btn.setAttribute('disabled', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   CLINICAL REPORT & DOCUMENT VIEWER
   -------------------------------------------------------------------------- */
function initReportDocumentViewer() {
  const viewReportButtons = document.querySelectorAll('.btn-view-report');

  viewReportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reportTitle = btn.getAttribute('data-report-title') || 'Clinical Comprehensive Encounter';
      const reportDate = btn.getAttribute('data-report-date') || 'September 2026';
      
      const docPreviewTitle = document.getElementById('docPreviewTitle');
      const docPreviewDate = document.getElementById('docPreviewDate');
      
      if (docPreviewTitle) docPreviewTitle.textContent = reportTitle;
      if (docPreviewDate) docPreviewDate.textContent = `Encounter Date: ${reportDate}`;

      const reportModal = document.getElementById('reportPreviewModal');
      if (reportModal && window.bootstrap) {
        const modalInstance = new bootstrap.Modal(reportModal);
        modalInstance.show();
      }
    });
  });
}
