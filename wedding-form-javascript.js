// ===== KODE JAVASCRIPT UNTUK HTML =====
// Ganti bagian JavaScript di HTML dengan kode ini

document.addEventListener('DOMContentLoaded', function() {
    // GANTI URL INI DENGAN URL GOOGLE APPS SCRIPT ANDA SETELAH DEPLOY
    const GOOGLE_SCRIPT_URL = 'PASTE_URL_GOOGLE_APPS_SCRIPT_DISINI';
    
    const form = document.getElementById('google-sheets-rsvp-form');
    const submitButton = document.getElementById('gs-submit-btn');
    const statusMessage = document.getElementById('gs-status-message');
    const wishesContainer = document.getElementById('wishes-container');
    
    // Load wishes on page load
    loadWishes();
    
    if (form && submitButton) {
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            sendToGoogleSheets();
        });
        
        // Handle attendance change to show/hide guest count
        const attendanceSelect = document.getElementById('gs-attendance');
        const guestWrapper = document.getElementById('gs-guest-wrapper');
        const guestSelect = document.getElementById('gs-guest');
        
        if (attendanceSelect && guestWrapper && guestSelect) {
            attendanceSelect.addEventListener('change', function() {
                if (this.value === 'present') {
                    guestWrapper.style.display = 'block';
                    guestSelect.required = true;
                } else {
                    guestWrapper.style.display = 'none';
                    guestSelect.required = false;
                    guestSelect.value = '';
                }
            });
        }
        
        // Add hover effects to button
        submitButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }
    
    function loadWishes() {
        wishesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Memuat ucapan...</div>';
        
        fetch(GOOGLE_SCRIPT_URL + '?action=getWishes')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.wishes) {
                    displayWishes(data.wishes);
                } else {
                    wishesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Belum ada ucapan</div>';
                }
            })
            .catch(error => {
                console.log('Error loading wishes:', error);
                wishesContainer.innerHTML = '<div style="text-align: center; color: #dc3545; padding: 20px;">❌ Gagal memuat ucapan. Periksa koneksi internet.</div>';
            });
    }
    
    function displayWishes(wishes) {
        if (wishes.length === 0) {
            wishesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Belum ada ucapan</div>';
            return;
        }
        
        let html = '';
        wishes.forEach(wish => {
            const attendanceIcon = wish.attendance === 'Hadir' ? '✅' : wish.attendance === 'Tidak Hadir' ? '❌' : '🤔';
            const timeAgo = getTimeAgo(new Date(wish.timestamp));
            
            html += `
                <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="color: #333; font-size: 14px;">${wish.name}</strong>
                        <span style="color: #666; font-size: 12px;">${timeAgo}</span>
                    </div>
                    <div style="color: #666; font-size: 13px; margin-bottom: 8px;">
                        ${attendanceIcon} ${wish.attendance} ${wish.guest && wish.guest !== '1' ? '• ' + wish.guest + ' orang' : ''}
                    </div>
                    <div style="color: #333; font-size: 14px; line-height: 1.4;">
                        "${wish.message}"
                    </div>
                </div>
            `;
        });
        
        wishesContainer.innerHTML = html;
    }
    
    function sendToGoogleSheets() {
        const name = document.getElementById('gs-author').value.trim();
        const attendance = document.getElementById('gs-attendance').value;
        const guest = document.getElementById('gs-guest').value;
        const message = document.getElementById('gs-message').value.trim();
        
        // Validation
        if (!name || name.length < 2) {
            showStatusMessage('❌ Mohon isi nama minimal 2 karakter', 'error');
            return;
        }
        
        if (!attendance) {
            showStatusMessage('❌ Mohon pilih konfirmasi kehadiran', 'error');
            return;
        }
        
        if (attendance === 'present' && !guest) {
            showStatusMessage('❌ Mohon pilih jumlah tamu', 'error');
            return;
        }
        
        if (!message || message.length < 2) {
            showStatusMessage('❌ Mohon tulis ucapan minimal 2 karakter', 'error');
            return;
        }
        
        // Disable button temporarily
        submitButton.disabled = true;
        submitButton.innerHTML = '💌 Mengirim...';
        
        // Create URL with parameters
        const params = new URLSearchParams({
            name: name,
            attendance: attendance,
            guest: guest || '1',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Send to Google Sheets
        fetch(GOOGLE_SCRIPT_URL + '?' + params.toString())
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showStatusMessage('✅ Terima kasih! Ucapan Anda telah terkirim.', 'success');
                    
                    // Reset form
                    form.reset();
                    document.getElementById('gs-guest-wrapper').style.display = 'none';
                    document.getElementById('gs-guest').required = false;
                    
                    // Reload wishes after 2 seconds
                    setTimeout(loadWishes, 2000);
                } else {
                    showStatusMessage('❌ Gagal mengirim ucapan: ' + data.message, 'error');
                }
                
                resetSubmitButton();
            })
            .catch(error => {
                console.log('Error sending to Google Sheets:', error);
                showStatusMessage('❌ Gagal mengirim ucapan. Periksa koneksi internet dan URL Google Apps Script.', 'error');
                resetSubmitButton();
            });
    }
    
    function resetSubmitButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = '💌 Kirim Ucapan';
    }
    
    function showStatusMessage(message, type) {
        statusMessage.style.display = 'block';
        statusMessage.innerHTML = message;
        
        // Set colors based on type
        if (type === 'success') {
            statusMessage.style.color = '#28a745';
            statusMessage.style.background = '#d4edda';
            statusMessage.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            statusMessage.style.color = '#dc3545';
            statusMessage.style.background = '#f8d7da';
            statusMessage.style.border = '1px solid #f5c6cb';
        }
        
        statusMessage.style.padding = '10px 15px';
        statusMessage.style.borderRadius = '5px';
        statusMessage.style.marginTop = '15px';
        
        // Hide message after 5 seconds
        setTimeout(function() {
            statusMessage.style.display = 'none';
        }, 5000);
    }
    
    function getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'baru saja';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return minutes + ' menit yang lalu';
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return hours + ' jam yang lalu';
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return days + ' hari yang lalu';
        }
    }
});
