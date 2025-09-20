const utils = {
    validateForm: function(formId) {
        const form = document.getElementById(formId);
        const required = form.querySelectorAll('[required]');
        let isValid = true;
        
        required.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('field-error');
                isValid = false;
            } else {
                field.classList.remove('field-error');
            }
        });
        
        return isValid;
    },
    
    collectFormData: function() {
        return {
            client: {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim()
            },
            job: {
                type: document.getElementById('jobType').value,
                source: document.getElementById('jobSource').value,
                description: document.getElementById('jobDescription').value.trim()
            },
            location: {
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                state: document.getElementById('state').value.trim(),
                zipCode: document.getElementById('zipCode').value.trim(),
                area: document.getElementById('area').value
            },
            schedule: {
                startDate: document.getElementById('startDate').value,
                startTime: document.getElementById('startTime').value,
                endTime: document.getElementById('endTime').value,
                assignee: document.getElementById('testSelect').value
            }
        };
    },
    
    formatPhoneNumber: function(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 0) return '';
        
        if (cleaned.length <= 3) {
            return `(${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    },
    
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    saveDraft: function(formData) {
        try {
            localStorage.setItem('jobDraft', JSON.stringify(formData));
            localStorage.setItem('draftTimestamp', new Date().toISOString());
            return true;
        } catch (e) {
            console.error('Failed to save draft:', e);
            return false;
        }
    },
    
    loadDraft: function() {
        try {
            const draft = localStorage.getItem('jobDraft');
            const timestamp = localStorage.getItem('draftTimestamp');
            
            if (draft) {
                return {
                    data: JSON.parse(draft),
                    timestamp: timestamp
                };
            }
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
        return null;
    },
    
    clearDraft: function() {
        try {
            localStorage.removeItem('jobDraft');
            localStorage.removeItem('draftTimestamp');
        } catch (e) {
            console.error('Failed to clear draft:', e);
        }
    },
    
    populateForm: function(formData) {
        if (formData.client) {
            document.getElementById('firstName').value = formData.client.firstName || '';
            document.getElementById('lastName').value = formData.client.lastName || '';
            document.getElementById('phone').value = formData.client.phone || '';
            document.getElementById('email').value = formData.client.email || '';
        }
        
        if (formData.job) {
            document.getElementById('jobType').value = formData.job.type || '';
            document.getElementById('jobSource').value = formData.job.source || '';
            document.getElementById('jobDescription').value = formData.job.description || '';
        }
        
        if (formData.location) {
            document.getElementById('address').value = formData.location.address || '';
            document.getElementById('city').value = formData.location.city || '';
            document.getElementById('state').value = formData.location.state || '';
            document.getElementById('zipCode').value = formData.location.zipCode || '';
            document.getElementById('area').value = formData.location.area || '';
        }
        
        if (formData.schedule) {
            document.getElementById('startDate').value = formData.schedule.startDate || '';
            document.getElementById('startTime').value = formData.schedule.startTime || '';
            document.getElementById('endTime').value = formData.schedule.endTime || '';
            document.getElementById('testSelect').value = formData.schedule.assignee || '';
        }
    },
    
    showNotification: function(message, type = 'success') {
        const notification = document.getElementById('successMessage');
        notification.textContent = message;
        notification.style.display = 'block';
        
        if (type === 'error') {
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
        } else {
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
        }
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    },
    
    toggleLoading: function(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'inline-block' : 'none';
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    getTodayDate: function() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    resetForm: function(formId) {
        document.getElementById(formId).reset();
        document.querySelectorAll('.field-error').forEach(field => {
            field.classList.remove('field-error');
        });
    }
};