// Pipedrive API integration functions

const pipedriveAPI = {
    // Create a person in Pipedrive
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

    // Create a deal in Pipedrive
    createDeal: async function(formData, personId) {
        const dealData = {
            title: `Job - ${formData.client.firstName} ${formData.client.lastName}`,
            person_id: personId,
            value: 0,
            currency: CONFIG.DEFAULTS.CURRENCY,
            status: CONFIG.DEFAULTS.DEAL_STATUS,

            // Custom fields
            ...(CONFIG.CUSTOM_FIELDS.JOB_TYPE && { [CONFIG.CUSTOM_FIELDS.JOB_TYPE]: formData.job.type }),
            ...(CONFIG.CUSTOM_FIELDS.JOB_SOURCE && { [CONFIG.CUSTOM_FIELDS.JOB_SOURCE]: formData.job.source }),
            ...(CONFIG.CUSTOM_FIELDS.JOB_DESCRIPTION && { [CONFIG.CUSTOM_FIELDS.JOB_DESCRIPTION]: formData.job.description }),
            ...(CONFIG.CUSTOM_FIELDS.SERVICE_ADDRESS && { [CONFIG.CUSTOM_FIELDS.SERVICE_ADDRESS]: formData.location.address }),
            ...(CONFIG.CUSTOM_FIELDS.SERVICE_CITY && { [CONFIG.CUSTOM_FIELDS.SERVICE_CITY]: formData.location.city }),
            ...(CONFIG.CUSTOM_FIELDS.SERVICE_STATE && { [CONFIG.CUSTOM_FIELDS.SERVICE_STATE]: formData.location.state }),
            ...(CONFIG.CUSTOM_FIELDS.SERVICE_ZIP && { [CONFIG.CUSTOM_FIELDS.SERVICE_ZIP]: formData.location.zipCode }),
            ...(CONFIG.CUSTOM_FIELDS.SERVICE_AREA && { [CONFIG.CUSTOM_FIELDS.SERVICE_AREA]: formData.location.area }),
            ...(CONFIG.CUSTOM_FIELDS.SCHEDULED_DATE && { [CONFIG.CUSTOM_FIELDS.SCHEDULED_DATE]: formData.schedule.startDate }),
            ...(CONFIG.CUSTOM_FIELDS.START_TIME && { [CONFIG.CUSTOM_FIELDS.START_TIME]: formData.schedule.startTime }),
            ...(CONFIG.CUSTOM_FIELDS.END_TIME && { [CONFIG.CUSTOM_FIELDS.END_TIME]: formData.schedule.endTime }),
            ...(CONFIG.CUSTOM_FIELDS.ASSIGNEE && { [CONFIG.CUSTOM_FIELDS.ASSIGNEE]: formData.schedule.assignee })
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

    // Create an activity (scheduled job) in Pipedrive
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
            assigned_to_user_id: formData.schedule.assignee || null
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

// Helper to calculate duration from start/end time (HH:mm → HH:mm)
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
