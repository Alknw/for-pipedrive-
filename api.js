const pipedriveAPI = {
    createPerson: async function(formData) {
        const personData = {
            name: `${formData.client.firstName} ${formData.client.lastName}`,
            email: formData.client.email ? [{ value: formData.client.email, primary: true }] : [],
            phone: formData.client.phone ? [{ value: formData.client.phone, primary: true }] : []
        };

        try {
            const response = await fetch(getApiUrl(CONFIG.ENDPOINTS.PERSONS), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Failed to create person');

            return result.data;
        } catch (error) {
            console.error('Error creating person:', error);
            throw error;
        }
    },

    createDeal: async function(formData, personId) {
        const dealData = {
            title: `Job - ${formData.client.firstName} ${formData.client.lastName}`,
            person_id: personId,
            value: 0,
            currency: CONFIG.DEFAULTS.CURRENCY,
            status: CONFIG.DEFAULTS.DEAL_STATUS
        };

        try {
            const response = await fetch(getApiUrl(CONFIG.ENDPOINTS.DEALS), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dealData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Failed to create deal');

            return result.data;
        } catch (error) {
            console.error('Error creating deal:', error);
            throw error;
        }
    },

    createActivity: async function(formData, dealId, personId) {
        const activityData = {
            subject: `Job - ${formData.job.type}`,
            type: CONFIG.DEFAULTS.ACTIVITY_TYPE,
            deal_id: dealId,
            person_id: personId,
            due_date: formData.schedule.startDate,
            due_time: formData.schedule.startTime || null,
            duration: formData.schedule.endTime && formData.schedule.startTime
                ? calculateDuration(formData.schedule.startTime, formData.schedule.endTime)
                : null,
        };

        try {
            const response = await fetch(getApiUrl(CONFIG.ENDPOINTS.ACTIVITIES), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activityData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Failed to create activity');

            return result.data;
        } catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    }
};

function calculateDuration(start, end) {
    try {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;
        const diff = Math.max(0, endMinutes - startMinutes);
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
        return null;
    }
}


