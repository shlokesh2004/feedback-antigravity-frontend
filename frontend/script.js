document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('feedbackForm');
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3')
    ];
    const progressBar = document.getElementById('progressBar');
    const currentStepNum = document.getElementById('currentStepNum');

    // Buttons
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const reviewBtn = document.getElementById('reviewBtn');
    const editBtn = document.getElementById('editBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Inputs
    const inputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
        ratingOps: document.getElementsByName('rating'),
        typeOps: document.getElementsByName('feedbackType')
    };

    let currentStep = 0;

    // --- Navigation Logic ---

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            step.classList.add('hidden');
            if (index === stepIndex) {
                step.classList.add('active');
                step.classList.remove('hidden');
            }
        });

        // Update Progress
        const progressPercent = ((stepIndex + 1) / 3) * 100;
        progressBar.style.width = `${progressPercent}%`;

        if (stepIndex < 2) {
            currentStepNum.textContent = stepIndex + 1;
        }

        currentStep = stepIndex;
        validateCurrentStep();
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep1()) showStep(1);
    });

    backBtn.addEventListener('click', () => showStep(0));

    reviewBtn.addEventListener('click', () => {
        if (validateStep2()) {
            populateReview();
            showStep(2);
        }
    });

    editBtn.addEventListener('click', () => showStep(1));

    // --- Validation Logic ---

    function validateStep1() {
        const isValid = inputs.name.value.trim() !== '' &&
            inputs.email.value.trim() !== '' &&
            inputs.email.checkValidity();
        nextBtn.disabled = !isValid;
        return isValid;
    }

    function validateStep2() {
        // Rating Check
        let ratingSelected = false;
        for (const radio of inputs.ratingOps) {
            if (radio.checked) ratingSelected = true;
        }

        // Message Check
        const messageValid = inputs.message.value.trim() !== '';

        const isValid = ratingSelected && messageValid;
        reviewBtn.disabled = !isValid;
        return isValid;
    }

    function validateCurrentStep() {
        if (currentStep === 0) validateStep1();
        if (currentStep === 1) validateStep2();
    }

    // Real-time validation listeners
    inputs.name.addEventListener('input', validateStep1);
    inputs.email.addEventListener('input', validateStep1);
    inputs.message.addEventListener('input', validateStep2);
    inputs.ratingOps.forEach(r => r.addEventListener('change', validateStep2));

    // --- Review & Submission ---

    function getSelectedValue(radios) {
        for (const radio of radios) {
            if (radio.checked) return radio.value;
        }
        return '';
    }

    function populateReview() {
        document.getElementById('reviewName').textContent = inputs.name.value;
        document.getElementById('reviewEmail').textContent = inputs.email.value;
        document.getElementById('reviewType').textContent = getSelectedValue(inputs.typeOps);
        document.getElementById('reviewRating').textContent = getSelectedValue(inputs.ratingOps);
        document.getElementById('reviewMessage').textContent = inputs.message.value;
    }

    // Submit Logic
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        setLoading(true);
        hideStatus();

        const data = {
            name: inputs.name.value.trim(),
            email: inputs.email.value.trim(),
            message: inputs.message.value.trim(),
            feedbackType: getSelectedValue(inputs.typeOps),
            rating: parseInt(getSelectedValue(inputs.ratingOps))
        };

        try {
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showStatus('Feedback submitted successfully! Thank you.', 'success');
                // Reset form and go back to step 1 after delay
                setTimeout(() => {
                    form.reset();
                    showStep(0);
                    hideStatus();
                }, 3000);
            } else {
                throw new Error(result.message || 'Error submitting feedback.');
            }
        } catch (error) {
            showStatus(error.message, 'error');
        } finally {
            setLoading(false);
        }
    });

    // --- Status & Loading Utilities (Same as before) ---
    const statusMessage = document.getElementById('statusMessage');
    const spinner = submitBtn.querySelector('.spinner');
    const btnText = submitBtn.querySelector('span');

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
            btnText.textContent = 'Sending...';
        } else {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Submit Feedback';
        }
    }

    function showStatus(msg, type) {
        statusMessage.textContent = msg;
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');
    }

    function hideStatus() {
        statusMessage.classList.add('hidden');
    }

    // Initialize
    showStep(0);
});
