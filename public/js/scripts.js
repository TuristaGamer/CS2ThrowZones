document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('submit-form');
    const mapImage = document.getElementById('map-image');
    const landingInput = document.getElementById('landing-position');
    const throwingInput = document.getElementById('throwing-position');

    let selectingLanding = false;
    let selectingThrowing = false;

    document.getElementById('select-landing-position').addEventListener('click', () => {
        selectingLanding = true;
        selectingThrowing = false;
    });

    document.getElementById('select-throwing-position').addEventListener('click', () => {
        selectingThrowing = true;
        selectingLanding = false;
    });

    mapImage.addEventListener('click', (event) => {
        const rect = mapImage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        if (selectingLanding) {
            landingInput.value = `${x.toFixed(2)},${y.toFixed(2)}`;
            addIcon('landing', x, y);
            selectingLanding = false;
        }

        if (selectingThrowing) {
            throwingInput.value = `${x.toFixed(2)},${y.toFixed(2)}`;
            addIcon('throwing', x, y);
            selectingThrowing = false;
        }
    });

    function addIcon(type, x, y) {
        const icon = document.createElement('img');
        icon.src = type === 'landing' ? `/img/icons/${type}.png` : '/img/icons/throwing.png';
        icon.classList.add('icon');
        icon.style.left = `${x}%`;
        icon.style.top = `${y}%`;
        mapImage.parentElement.appendChild(icon);
    }

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const map = document.getElementById('map').value;
        const type = document.getElementById('type').value;
        const video = document.getElementById('video').value;
        const landingPosition = landingInput.value;
        const throwingPosition = throwingInput.value;

        const grenade = {
            map,
            type,
            video,
            landingPosition,
            throwingPosition
        };

        let grenades = JSON.parse(localStorage.getItem('grenades')) || [];
        grenades.push(grenade);
        localStorage.setItem('grenades', JSON.stringify(grenades));

        alert('Grenade submitted successfully!');
    });

    document.getElementById('map').addEventListener('change', function() {
        const selectedMap = this.value;
        mapImage.src = `/img/${selectedMap}-map.jpg`;
    });
});

function mapFiltering(map, grenadeType) {
    const mapContainer = document.querySelector('.map-container img');
    if (mapContainer) {
        mapContainer.style.width = '85%';
        mapContainer.style.maxWidth = '850px';
    }

    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.style.display = 'none';
    });

    document.querySelectorAll('.grenade-point').forEach(icon => {
        if (grenadeType === 'empty') {
            icon.style.display = 'none';
        } else if (icon.classList.contains(grenadeType)) {
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    });

    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => {
        item.classList.remove('selected');
        if (item.id === grenadeType) {
            item.classList.add('selected');
        }
    });
}
