(function() {
    if (typeof PipedriveSDK !== 'undefined') {
        PipedriveSDK.initialize({
            appName: 'Workiz'
        }).then(() => {
            console.log('✅ Pipedrive SDK initialized successfully');
        }).catch((error) => {
            console.error('❌ Failed to initialize Pipedrive SDK:', error);
        });

        function resizePanel() {
            const height = Math.min(document.body.scrollHeight + 50, 750); 
            PipedriveSDK.resize(height);
        }

        window.addEventListener('load', function() {
            setTimeout(resizePanel, 100); 
        });

        window.addEventListener('resize', resizePanel);

        const originalSubmit = document.getElementById("submitBtn");
        if (originalSubmit) {
            originalSubmit.addEventListener('click', function() {
                setTimeout(resizePanel, 500); 
            });
        }
    } else {
        console.log('ℹ️ Pipedrive SDK not available - running in standalone mode');
    }
})();

document.getElementById("submitBtn").addEventListener("click", async () => {
    if (!utils.validateForm("jobForm")) {
        utils.showNotification("Please fill all required fields", "error");
        return;
    }

    const formData = utils.collectFormData();
    utils.toggleLoading(true);

    try {
        const person = await pipedriveAPI.createPerson(formData);
        const deal = await pipedriveAPI.createDeal(formData, person.id);
        const activity = await pipedriveAPI.createActivity(formData, deal.id, person.id);

        utils.showNotification("Job created successfully!", "success");
        console.log({ person, deal, activity });

        utils.resetForm("jobForm");
        utils.clearDraft();
        
        if (typeof PipedriveSDK !== 'undefined') {
            setTimeout(() => {
                const height = Math.min(document.body.scrollHeight + 50, 750);
                PipedriveSDK.resize(height);
            }, 500);
        }
    } catch (err) {
        utils.showNotification("Failed to create job. Check console.", "error");
    } finally {
        utils.toggleLoading(false);
    }
});

document.getElementById("saveBtn").addEventListener("click", () => {
    const formData = utils.collectFormData();
    utils.saveDraft(formData);
    utils.showNotification("Draft saved locally", "success");
    
    if (typeof PipedriveSDK !== 'undefined') {
        setTimeout(() => {
            const height = Math.min(document.body.scrollHeight + 50, 750);
            PipedriveSDK.resize(height);
        }, 100);
    }
});
