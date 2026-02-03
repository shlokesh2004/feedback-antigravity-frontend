document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loadingStats');
    const content = document.getElementById('statsContent');
    const totalEl = document.getElementById('totalCount');
    const avgEl = document.getElementById('avgRating');
    const barsContainer = document.getElementById('typeBars');

    try {
        const response = await fetch('http://localhost:5000/api/feedback/stats');
        const data = await response.json();

        if (response.ok) {
            renderStats(data);
        } else {
            console.error('Failed to load stats:', data.message);
            showError();
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        showError();
    } finally {
        loading.classList.add('hidden');
        content.classList.remove('hidden');
    }

    function renderStats(data) {
        // Total & Avg
        animateValue(totalEl, 0, data.total, 1000);
        animateValue(avgEl, 0, data.avgRating, 1000, true);

        // Type Breakdown
        // Define all possible types to ensure consistent order, or just use what's returned
        const types = ["Suggestion", "Complaint", "Appreciation", "Other"];
        const counts = data.typeCounts || {};
        const maxCount = Math.max(...Object.values(counts).concat(0)) || 1; // Avoid divide by zero

        types.forEach(type => {
            const count = counts[type] || 0;
            const percentage = (count / maxCount) * 100;

            // Map types to icons/colors
            let icon = '📝';
            if (type === 'Suggestion') icon = '💡';
            if (type === 'Complaint') icon = '⚠️';
            if (type === 'Appreciation') icon = '❤️';

            const barHTML = `
                <div class="type-stat">
                    <div class="type-label">
                        <span>${icon} ${type}</span>
                        <span class="type-count">${count}</span>
                    </div>
                    <div class="bar-bg">
                        <div class="bar-fill" style="width: 0%" data-width="${percentage}%"></div>
                    </div>
                </div>
            `;
            barsContainer.innerHTML += barHTML;
        });

        // Animate bars
        setTimeout(() => {
            document.querySelectorAll('.bar-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);
    }

    function animateValue(obj, start, end, duration, isFloat = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const val = progress * (end - start) + start;
            obj.innerHTML = isFloat ? val.toFixed(1) : Math.floor(val);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function showError() {
        content.innerHTML = '<p style="text-align:center; color: var(--error-color);">Failed to load insights. Please try again later.</p>';
        content.classList.remove('hidden');
    }
});
