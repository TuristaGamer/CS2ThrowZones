const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Função para extrair o ID do YouTube
function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return (match && match[1]) || null;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/maps/:mapName', (req, res) => {
    const mapName = req.params.mapName;
    const grenadesDir = path.join(__dirname, 'public', 'grenades', mapName);
    const types = ['smoke', 'molotov', 'flashbang', 'he'];
    const grenades = {};

    types.forEach(type => {
        const filePath = path.join(grenadesDir, type, `${mapName}-${type}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                if (fileContent.trim()) {
                    grenades[type] = JSON.parse(fileContent);
                } else {
                    grenades[type] = [];
                }
            } catch (error) {
                console.error(`Error parsing JSON for ${type} in ${mapName}:`, error);
                grenades[type] = [];
            }
        } else {
            grenades[type] = [];
        }
    });

    res.render('map', { mapName, grenades });
});

app.get('/grenades/:mapName/all', (req, res) => {
    const mapName = req.params.mapName;
    const grenadesDir = path.join(__dirname, 'public', 'grenades', mapName);
    const types = ['smoke', 'molotov', 'flashbang', 'he'];
    const grenades = {};

    types.forEach(type => {
        const filePath = path.join(grenadesDir, type, `${mapName}-${type}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                if (fileContent.trim()) {
                    grenades[type] = JSON.parse(fileContent);
                } else {
                    grenades[type] = [];
                }
            } catch (error) {
                console.error(`Error parsing JSON for ${type} in ${mapName}:`, error);
                grenades[type] = [];
            }
        } else {
            grenades[type] = [];
        }
    });

    res.json(grenades);
});

app.get('/grenades/:mapName/:type/:grenadeId', (req, res) => {
    const { mapName, type, grenadeId } = req.params;
    const filePath = path.join(__dirname, 'public', 'grenades', mapName, type, `${mapName}-${type}.json`);
    const grenades = JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
    const grenade = grenades.find(g => g.id === parseInt(grenadeId, 10));

    if (grenade) {
        grenade.videoID = extractYouTubeID(grenade.video); // Extrair o ID do vídeo e adicioná-lo ao objeto grenade
        res.render('grenade', { grenade });
    } else {
        res.status(404).send('Grenade not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
