(function() {
    const AppExtensionsSDK = typeof window !== 'undefined' && window.AppExtensionsSDK 
        ? window.AppExtensionsSDK 
        : typeof global !== 'undefined' && global.AppExtensionsSDK;

    if (AppExtensionsSDK) {
        new AppExtensionsSDK().initialize()
            .then((sdk) => {
                console.log('✅ Pipedrive App Extensions SDK initialized successfully');
                window.pipedriveSDK = sdk; 
                
                function resizePanel() {
                    if (window.pipedriveSDK) {
                        const height = Math.min(document.body.scrollHeight + 50, 750);
                        window.pipedriveSDK.execute('RESIZE', { height: height })
                            .catch(err => console.log('Resize failed:', err));
                    }
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
            })
            .catch((error) => {
                console.error('❌ Failed to initialize Pipedrive App Extensions SDK:', error);
            });
    } else {
        console.log('ℹ️ Pipedrive App Extensions SDK not available - running in standalone mode');
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
        
        if (window.pipedriveSDK) {
            setTimeout(() => {
                const height = Math.min(document.body.scrollHeight + 50, 750);
                window.pipedriveSDK.execute('RESIZE', { height: height })
                    .catch(err => console.log('Resize failed:', err));
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
    
    if (window.pipedriveSDK) {
        setTimeout(() => {
            const height = Math.min(document.body.scrollHeight + 50, 750);
            window.pipedriveSDK.execute('RESIZE', { height: height })
                .catch(err => console.log('Resize failed:', err));
        }, 100);
    }
});
