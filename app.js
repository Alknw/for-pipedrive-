// app.js

// Request is sent
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
    } catch (err) {
        utils.showNotification("Failed to create job. Check console.", "error");
    } finally {
        utils.toggleLoading(false);
    }
});

// Save as draft
document.getElementById("saveBtn").addEventListener("click", () => {
    const formData = utils.collectFormData();
    utils.saveDraft(formData); // assuming you have this util
    utils.showNotification("Draft saved locally", "success");
});
