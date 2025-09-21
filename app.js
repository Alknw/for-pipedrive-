document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submitBtn");
    const saveButton = document.getElementById("saveBtn");

    if (submitButton) {
        submitButton.addEventListener("click", async function (e) { 
            e.preventDefault(); 

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
            } catch (err) {
                utils.showNotification("Failed to create job. Check console.", "error");
            } finally {
                utils.toggleLoading(false);
            }
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const formData = utils.collectFormData();
            utils.saveDraft(formData);
            utils.showNotification("Draft saved locally", "success");
        });
    }
});
