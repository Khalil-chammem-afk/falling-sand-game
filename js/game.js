class Game {
    constructor() {
        // Particle type names for display
        this.PARTICLE_NAMES = {
            0: 'Empty',
            1: 'Dirt',
            2: 'Sand',
            3: 'Water',
            4: 'Ice',
            5: 'Steam',
            6: 'Mud',
            7: 'Wet Sand',
            8: 'Glass',
            9: 'Lightning',
            10: 'Grass',
            11: 'Dead Plant',
            12: 'Fire',
            13: 'Smoke',
            14: 'Charcoal',
            15: 'Frozen Plant',
            16: 'Lava',
            17: 'Wall',
            18: 'Obsidian',
            19: 'Magma',
            20: 'Oil',
            21: 'Dirty Water',
            22: 'Basalt',
            23: 'Cloud',
            24: 'Rain Cloud',
            25: 'Molten Glass',
            26: 'Rock',
            27: 'Snow', // new
            28: 'Gravel', // new gravel element
            29: 'Molten Dirt', // add after gravel
            30: 'Cactus' // cactus element
        };
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.infoDisplay = document.getElementById('infoDisplay');
        this.infoDisplay.textContent = 'ELEM: - | TEMP: -';
        this.infoDisplay.style.visibility = 'visible';
        
        // Set canvas size
        this.canvas.width = 960;
        this.canvas.height = 540;
        
        // Grid settings
        this.cellSize = 4; // Size of each particle in pixels
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        
        // Particle types
        this.PARTICLE_TYPES = {
            empty: 0,
            dirt: 1,
            sand: 2,
            water: 3,
            ice: 4,
            steam: 5,
            mud: 6,
            wetsand: 7,
            glass: 8,
            lightning: 9,
            grass: 10,
            deadplant: 11,
            fire: 12,
            smoke: 13,
            charcoal: 14,
            frozenplant: 15,
            lava: 16,
            wall: 17,
            obsidian: 18,
            magma: 19,
            oil: 20,
            dirtywater: 21,
            basalt: 22,
            cloud: 23,
            raincloud: 24,
            moltenglass: 25,
            rock: 26,
            snow: 27, // new
            gravel: 28, // new gravel element
            moltendirt: 29, // add after gravel
            cactus: 30 // cactus element
        };
        // Particle colors
        this.PARTICLE_COLORS = {
            0: null,
            1: ['rgb(60, 40, 20)', 'rgb(80, 50, 25)', 'rgb(70, 45, 18)', 'rgb(90, 60, 30)', 'rgb(65, 48, 28)', 'rgb(75, 55, 35)'], // dirt
            2: ['#ffe39f', '#ffe08a', '#ffe7b3', '#ffe4a1', '#ffe6a8'], // sand
            3: ['#047AF2', '#1184F4', '#046CE4', '#1D84F4'], // water
            4: ['#e0f7fa', '#b2ebf2', '#b3e5fc', '#e1f5fe'], // ice
            5: ['#b3cfe3', '#a3bed6', '#c7e3f7', '#b8d8f7'], // steam
            6: ['#362217', '#442C24', '#2C140C', '#3C2C24', '#443424'], // mud
            7: ['#e0d7b3', '#d2c295', '#c2b280', '#bfa76a'], // wet sand
            8: ['#a3cfcf', '#b2ebf2', '#c1f0f6', '#d0f7f7', '#b7d9d9'], // glass
            9: ['#fff700', '#fffbe0', '#ffe066', '#fff'], // lightning
            10: ['#4CAF50', '#45a049', '#3d8b40', '#357935', '#2e672a'], // grass
            11: ['#8B4513', '#7a3d10', '#6b3510', '#5c2e0f'], // dead plant
            12: ['#ff4500', '#ff6a00', '#ff8c00', '#ffa500', '#ff7f00'], // fire
            13: ['#404040', '#303030', '#202020', '#101010'], // smoke
            14: ['#1a1a1a', '#262626', '#333333', '#404040'], // charcoal
            15: ['#b2f7e6', '#a0e6d6', '#c2fff7', '#d0fff0'], // frozen plant
            16: ['#ff4500', '#ff5500', '#ff6500', '#ff7500', '#ff8500'], // lava
            17: ['#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#848484', '#848484', '#848484', '#848484'], // wall
            18: ['#2d2d2d', '#1a1a1a', '#000000'], // obsidian
            19: ['#ffb347', '#ff8300', '#ff5e13', '#ff2e00', '#ff7e00'], // magma
            20: ['#420D04', '#4C140A', '#541C14', '#4C1C0C', '#340404'], // oil
            21: ['#2e8b57', '#3cb371', '#20b2aa', '#48d1cc'], // dirty water
            22: ['#808080', '#707070', '#606060', '#505050'], // basalt
            23: ['#d3d3d3', '#c0c0c0', '#e0e0e0', '#f0f0f0'], // cloud
            24: ['#888888', '#666666', '#999999', '#555555'], // rain cloud
            25: ['#ffb347', '#ffae42', '#ff9900', '#ff7f00', '#ffcc80', '#ffd580', '#ff9933', '#ff6600', '#ffb366', '#ffcc66'], // molten glass
            26: ['#808080', '#707070', '#606060', '#505050', '#404040'], // rock
            27: ['#ffffff', '#f5f5f5', '#f0f0f0', '#e8e8e8', '#e0e0e0'], // snow (white shades)
            28: ['#c0c0c0', '#d3d3d3', '#b8b8b8', '#a8a8a8', '#e0e0e0'], // gravel (gray shades)
            29: ['#b84c1c', '#d2691e', '#c75a1c', '#e07b3c', '#b85a1c'], // molten dirt palette
            30: ['#2E8B57', '#3CB371', '#4CAF50', '#45a049', '#3d8b40'] // cactus (green shades)
        };
        
        // Initialize grid (store {type, color})
        this.grid = new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null).map(() => ({ type: 0, color: null, temperature: 20, lifetime: null, edgeAge: null })));
        
        // Mouse interaction
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.selectedParticle = 'dirt';
        this.selectedTool = 'particle'; // 'particle', 'heater', 'cooler', 'eraser'
        
        this.brushSize = 5;
        this.lightningPath = [];
        this.lightningTimer = 0;
        this.smokeTimer = new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(0));
        this.setupEventListeners();
        this.setupToolbar();
        this.setupBrushWheel();
        this.gameLoop();
        this.isShiftDown = false;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') this.isShiftDown = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') this.isShiftDown = false;
        });
        // Ensure infoDisplay is updated on load
        this.update();
        // Add this near the top of the Game class, after PARTICLE_TYPES:
        this.CONDUCTIVITY = {
            wall: 0,
            glass: 0.08,
            sand: 0.3,
            dirt: 0.10,
            water: 0.5,
            magma: 0.7,
            moltenglass: 0.6,
            basalt: 0.09,
            obsidian: 0.05,
            lava: 0.6,
            fire: 0.3,
            steam: 0.2,
            ice: 0.03,
            cloud: 0.01,
            raincloud: 0.01,
            charcoal: 0.15,
            mud: 0.11,
            wetsand: 0.13,
            oil: 0.18,
            deadplant: 0.08,
            frozenplant: 0.04,
            grass: 0.09,
            smoke: 0.01,
            lightning: 0.9,
            dirtwater: 0.3,
            empty: 0,
            rock: 0.12,
            snow: 0.02, // Snow has low conductivity
            gravel: 0.15 // Gravel has medium conductivity
        };
        this.canvas.addEventListener('mouseenter', () => {
            // Do nothing here, handled in mousemove
        });
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Fix: scale mouse coordinates to canvas size
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.mouseX = Math.floor((e.clientX - rect.left) * scaleX / this.cellSize);
            this.mouseY = Math.floor((e.clientY - rect.top) * scaleY / this.cellSize);
            // Update info display
            if (this.mouseX >= 0 && this.mouseX < this.cols && this.mouseY >= 0 && this.mouseY < this.rows) {
                const cell = this.grid[this.mouseX][this.mouseY];
                if (cell.type !== this.PARTICLE_TYPES.empty) {
                    this.infoDisplay.style.opacity = '1';
                    this.infoDisplay.textContent = `ELEM: ${this.PARTICLE_NAMES[cell.type]}  TEMP: ${Math.round(cell.temperature)}°C`;
                } else {
                    this.infoDisplay.style.opacity = '0';
                }
            } else {
                this.infoDisplay.style.opacity = '0';
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.infoDisplay.style.opacity = '0';
        });
    }

    setupToolbar() {
        const toolbar = document.getElementById('toolbar');
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn) {
                if (btn.id === 'resetBtn') {
                    this.resetGrid();
                } else if (btn.id === 'heaterBtn') {
                    this.selectedTool = 'heater';
                    this.enableBrushWheel(true);
                } else if (btn.id === 'coolerBtn') {
                    this.selectedTool = 'cooler';
                    this.enableBrushWheel(true);
                } else if (btn.id === 'eraserBtn') {
                    this.selectedTool = 'eraser';
                    this.enableBrushWheel(true);
                } else if (btn.getAttribute('data-particle') === 'lightning') {
                    this.selectedTool = 'particle';
                    this.selectedParticle = 'lightning';
                    this.prevBrushSize = this.brushSize;
                    this.brushSize = 1;
                    this.enableBrushWheel(false);
                } else if (btn.hasAttribute('data-particle')) {
                    this.selectedTool = 'particle';
                    this.selectedParticle = btn.getAttribute('data-particle');
                    if (this.selectedParticle !== 'lightning' && this.prevBrushSize) {
                        this.brushSize = this.prevBrushSize;
                    }
                    this.enableBrushWheel(true);
                }
            }
        });
    }

    enableBrushWheel(enable) {
        if (!this._wheelHandler) {
            this._wheelHandler = (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.brushSize = Math.min(this.brushSize + 1, 15);
                } else if (e.deltaY > 0) {
                    this.brushSize = Math.max(this.brushSize - 1, 1);
                }
            };
        }
        if (enable) {
            this.canvas.addEventListener('wheel', this._wheelHandler);
        } else {
            this.canvas.removeEventListener('wheel', this._wheelHandler);
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Fix: scale mouse coordinates to canvas size
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.mouseX = Math.floor((e.clientX - rect.left) * scaleX / this.cellSize);
            this.mouseY = Math.floor((e.clientY - rect.top) * scaleY / this.cellSize);
            // Update info display
            if (this.mouseX >= 0 && this.mouseX < this.cols && this.mouseY >= 0 && this.mouseY < this.rows) {
                const cell = this.grid[this.mouseX][this.mouseY];
                if (cell.type !== this.PARTICLE_TYPES.empty) {
                    this.infoDisplay.style.opacity = '1';
                    this.infoDisplay.textContent = `ELEM: ${this.PARTICLE_NAMES[cell.type]}  TEMP: ${Math.round(cell.temperature)}°C`;
                } else {
                    this.infoDisplay.style.opacity = '0';
                }
            } else {
                this.infoDisplay.style.opacity = '0';
            }
        });

        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.infoDisplay.style.opacity = '0';
        });
    }

    setupBrushWheel() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.brushSize = Math.min(this.brushSize + 1, 15);
            } else if (e.deltaY > 0) {
                this.brushSize = Math.max(this.brushSize - 1, 1);
            }
        });
    }

    pickWaterColor() {
        const r = Math.random();
        if (r<0.05) return '#047AF2';
        if (r<0.1) return '#1184F4'
        if (r < 0.95) return '#046CE4';
        return '#1D84F4';
    }

    placeParticle(x, y, type) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            // Special case for lightning: path-based visual and impact
            if (type === 'lightning') {
                let cx = x;
                let cy = y;
                let path = [];
                let struck = false;
                while (cy < this.rows) {
                    path.push([cx, cy]);
                    const t = this.grid[cx][cy].type;
                    if (t !== this.PARTICLE_TYPES.empty && t !== this.PARTICLE_TYPES.steam && t !== this.PARTICLE_TYPES.lightning) {
                        struck = true;
                        // Impact: affect a small area below the strike
                        let depth = 3 + Math.floor(Math.random() * 4); // 3-6
                        let width = 3 + Math.floor(Math.random() * 3); // 3-5
                        let halfW = Math.floor(width / 2);
                        for (let d = 0; d < depth; d++) {
                            let yy = cy + d;
                            if (yy >= this.rows) break;
                            for (let wx = -halfW; wx <= halfW; wx++) {
                                let xx = cx + wx;
                                if (xx < 0 || xx >= this.cols) continue;
                                let cell = this.grid[xx][yy];
                                if (cell.type === this.PARTICLE_TYPES.grass) {
                                    // Convert grass to fire
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                    this.grid[xx][yy] = { 
                                        type: this.PARTICLE_TYPES.fire, 
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: 100,
                                        lifetime: null
                                    };
                                } else if (cell.type === this.PARTICLE_TYPES.water) {
                                    // Vaporize water: turn to steam
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                    this.grid[xx][yy] = { type: this.PARTICLE_TYPES.steam, color: colorArr[Math.floor(Math.random() * colorArr.length)], temperature: 100, lifetime: null };
                                } else if (cell.type === this.PARTICLE_TYPES.sand) {
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.glass];
                                    this.grid[xx][yy] = { type: this.PARTICLE_TYPES.glass, color: colorArr[Math.floor(Math.random() * colorArr.length)], temperature: 20, lifetime: null };
                                } else if (cell.type === this.PARTICLE_TYPES.dirt || cell.type === this.PARTICLE_TYPES.mud) {
                                    // Char or heat dirt/mud
                                    this.grid[xx][yy].temperature += 200;
                                }
                            }
                        }
                        break;
                    }
                    // Jaggedness
                    if (Math.random() < 0.3) {
                        cx += Math.floor(Math.random() * 3) - 1;
                        if (cx < 0) cx = 0;
                        if (cx >= this.cols) cx = this.cols - 1;
                    }
                    cy++;
                }
                // Store path for rendering
                this.lightningPath = path;
                this.lightningTimer = 10;
                return;
            }
            // Only place if empty
            if (this.grid[x][y].type !== this.PARTICLE_TYPES.empty) return;
            let color;
            if (type === 'water') {
                color = this.pickWaterColor();
            } else if (type === 'oil') {
                // Weighted color selection for oil (user provided browns, new weights)
                const r = Math.random();
                if (r < 0.85) color = '#420D04';
                else if (r < 0.90) color = '#4C140A';
                else if (r < 0.94) color = '#541C14';
                else if (r < 0.97) color = '#4C1C0C';
                else color = '#340404';
            } else if (type === 'mud') {
                // Weighted color selection for mud with #2C140C as main color
                const r = Math.random();
                if (r < 0.85) color = '#2C140C';  // 85% chance for main color
                else if (r < 0.90) color = '#362217';
                else if (r < 0.94) color = '#442C24';
                else if (r < 0.97) color = '#3C2C24';
                else color = '#443424';
            } else {
                let colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES[type]];
                color = colorArr ? colorArr[Math.floor(Math.random() * colorArr.length)] : null;
            }
            let temperature = 20;
            let lifetime = null;
            if (type === 'lightning') lifetime = 5 + Math.floor(Math.random() * 3); // short lifespan
            if (type === 'smoke') lifetime = 300 + Math.floor(Math.random() * 200); // 300-500 frames lifetime for smoke
            if (type === 'steam') {
                temperature = 120;
                lifetime = 600 + Math.floor(Math.random() * 300); // 600-900 frames
            }
            if (type === 'magma') {
                temperature = 1200; // Set initial temperature very high for magma
            }
            if (type === 'cloud') {
                temperature = 110; // Set initial temperature for cloud as per wiki
            }
            if (type === 'snow') {
                temperature = -5; // Set initial temperature for snow as per wiki
            }
            // Assign baseColor for sand
            if (type === 'sand') {
                this.grid[x][y] = { type: this.PARTICLE_TYPES[type], color, baseColor: color, temperature, lifetime };
            } else {
                this.grid[x][y] = { type: this.PARTICLE_TYPES[type], color, temperature, lifetime };
            }
        }
    }

    update() {
        // Only update infoDisplay if mouse is over a non-empty cell
        if (this.mouseX >= 0 && this.mouseX < this.cols && this.mouseY >= 0 && this.mouseY < this.rows) {
            const cell = this.grid[this.mouseX][this.mouseY];
            if (cell.type !== this.PARTICLE_TYPES.empty) {
                this.infoDisplay.style.opacity = '1';
                this.infoDisplay.textContent = `ELEM: ${this.PARTICLE_NAMES[cell.type]}  TEMP: ${Math.round(cell.temperature)}°C`;
            } else {
                this.infoDisplay.style.opacity = '0';
            }
        } else {
            this.infoDisplay.style.opacity = '0';
        }
        if (this.isMouseDown) {
            // Use square brush area instead of circular
            for (let i = -this.brushSize; i <= this.brushSize; i++) {
                for (let j = -this.brushSize; j <= this.brushSize; j++) {
                    const x = this.mouseX + i;
                    const y = this.mouseY + j;
                    if (this.selectedTool === 'particle') {
                        this.placeParticle(x, y, this.selectedParticle);
                    } else if (this.selectedTool === 'heater') {
                        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                            // Lower delta for more Sandboxels-like heating
                            let delta = this.isShiftDown ? (2 + Math.floor(Math.random() * 15)) : (2 + Math.floor(Math.random() * 4));
                            // Only heat if not wall
                            if (this.grid[x][y].type !== this.PARTICLE_TYPES.wall) {
                                this.grid[x][y].temperature += delta;
                            }
                        }
                    } else if (this.selectedTool === 'cooler') {
                        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                            // Wiki-accurate: -2 to -5°C, or -2 to -32°C with Shift
                            let delta = this.isShiftDown ? (2 + Math.floor(Math.random() * 31)) : (2 + Math.floor(Math.random() * 4));
                            this.grid[x][y].temperature -= delta;
                        }
                    } else if (this.selectedTool === 'eraser') {
                        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                            this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null, edgeAge: null };
                        }
                    }
                }
            }
        }

        // Temperature transfer
        // Create a copy of the temperature grid
        let tempGrid = new Array(this.cols).fill(null).map(() => new Array(this.rows).fill(0));
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                tempGrid[x][y] = this.grid[x][y].temperature;
            }
        }
        let waterDebugLogged = false;
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cell = this.grid[x][y];
                if (cell.type !== this.PARTICLE_TYPES.empty && cell.type !== this.PARTICLE_TYPES.water) {
                    let typeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === cell.type);
                    let cellConduct = this.CONDUCTIVITY[typeName] !== undefined ? this.CONDUCTIVITY[typeName] : 0.1;
                    if (typeof cellConduct !== 'number' || isNaN(cellConduct)) cellConduct = 0.1;
                    if (cellConduct === 0) continue;
                    if (typeof tempGrid[x][y] !== 'number' || isNaN(tempGrid[x][y])) tempGrid[x][y] = 20;
                    let sum = 0;
                    let count = 0;
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type !== this.PARTICLE_TYPES.empty) {
                                let nTypeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === neighbor.type);
                                let nConduct = this.CONDUCTIVITY[nTypeName] !== undefined ? this.CONDUCTIVITY[nTypeName] : 0.1;
                                if (typeof nConduct !== 'number' || isNaN(nConduct)) nConduct = 0.1;
                                if (nConduct === 0) continue;
                                if (typeof tempGrid[nx][ny] !== 'number' || isNaN(tempGrid[nx][ny])) tempGrid[nx][ny] = 20;
                                sum += tempGrid[nx][ny];
                                count++;
                            }
                        }
                    }
                    let heatTransferRate = 0.08;
                    if (typeof heatTransferRate !== 'number' || isNaN(heatTransferRate)) heatTransferRate = 0.08;
                    if (count > 0) {
                        cell.temperature += (sum/count - tempGrid[x][y]) * cellConduct * heatTransferRate;
                    }
                }
            }
        }

        // Reactions: water + dirt → mud, water + sand → wet sand
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cell = this.grid[x][y];
                // Check both water next to dirt and dirt next to water
                if (cell.type === this.PARTICLE_TYPES.water || cell.type === this.PARTICLE_TYPES.dirt) {
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (cell.type === this.PARTICLE_TYPES.dirt && neighbor.type === this.PARTICLE_TYPES.water) {
                                // Dirt absorbs water and becomes mud
                                const mudColor = this.PARTICLE_COLORS[this.PARTICLE_TYPES.mud];
                                cell.type = this.PARTICLE_TYPES.mud;
                                cell.color = mudColor[Math.floor(Math.random() * mudColor.length)];
                                // Remove the water
                                this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                            } else if ((cell.type === this.PARTICLE_TYPES.water && neighbor.type === this.PARTICLE_TYPES.sand) ||
                                       (cell.type === this.PARTICLE_TYPES.sand && neighbor.type === this.PARTICLE_TYPES.water)) {
                                // Water + Sand → Wet Sand
                                const wetSandColor = this.PARTICLE_COLORS[this.PARTICLE_TYPES.wetsand];
                                cell.type = this.PARTICLE_TYPES.wetsand;
                                cell.color = wetSandColor[Math.floor(Math.random() * wetSandColor.length)];
                                neighbor.type = this.PARTICLE_TYPES.wetsand;
                                neighbor.color = wetSandColor[Math.floor(Math.random() * wetSandColor.length)];
                            }
                        }
                    }
                }
            }
        }

        // Update physics (bottom-up)
        for (let x = 0; x < this.cols; x++) {
            for (let y = this.rows - 1; y >= 0; y--) {
                const cell = this.grid[x][y];
                if (cell.type === this.PARTICLE_TYPES.dirt) {
                    // Dirt falls through empty or water (vertical and diagonals, no priority)
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    // Gradually glow from brown to orange/red as it heats up
                    if (!cell.baseColor) {
                        const dirtPalette = this.PARTICLE_COLORS[this.PARTICLE_TYPES.dirt];
                        cell.baseColor = cell.color || dirtPalette[Math.floor(Math.random() * dirtPalette.length)];
                    }
                    if (cell.temperature >= 500 && cell.temperature < 1200) {
                        let t = (cell.temperature - 500) / (1200 - 500); // 0 to 1 for 500-1200°C
                        if (t < 0.5) {
                            let t2 = t / 0.5;
                            cell.color = lerpColor(cell.baseColor, '#ffae42', t2);
                        } else {
                            let t2 = (t - 0.5) / 0.5;
                            cell.color = lerpColor('#ffae42', '#ff3300', t2);
                        }
                    } else {
                        // Normal dirt color
                        if (cell.baseColor && cell.color !== cell.baseColor && cell.temperature < 500) {
                            cell.color = cell.baseColor;
                        }
                    }
                    // MELTING: Dirt melts into Molten Dirt at 1200°C
                    if (cell.temperature >= 1200) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltendirt];
                        cell.type = this.PARTICLE_TYPES.moltendirt;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 1200;
                        delete cell.baseColor;
                    }
                } else if (cell.type === this.PARTICLE_TYPES.moltendirt) {
                    // Molten Dirt flows like a liquid (like molten glass)
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                    // Vibrant orange/red cycling as it stays hot
                    if (!cell.baseColor) {
                        const moltenPalette = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltendirt];
                        cell.baseColor = cell.color || moltenPalette[Math.floor(Math.random() * moltenPalette.length)];
                    }
                    // Color interpolation for molten dirt (1200°C+)
                    let t = Math.min((cell.temperature - 1100) / 200, 1); // 0 to 1 for 1100-1300°C
                    cell.color = lerpColor('#e07b3c', '#b84c1c', t); // orange to deep red
                    // Cool to rock at ≤ 1100°C
                    if (cell.temperature <= 1100) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.rock];
                        cell.type = this.PARTICLE_TYPES.rock;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 20;
                        delete cell.baseColor;
                    }
                } else if (cell.type === this.PARTICLE_TYPES.sand) {
                    if (cell.temperature >= 1700) {
                        // Sand becomes molten glass
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltenglass];
                        cell.type = this.PARTICLE_TYPES.moltenglass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature >= 500) {
                        // Gradually glow from yellow to red as temperature increases
                        let t = (cell.temperature - 500) / (1700 - 500); // 0 to 1
                        const sandPalette = this.PARTICLE_COLORS[this.PARTICLE_TYPES.sand];
                        // Use the original color as the base for interpolation, or assign if missing
                        if (!cell.baseColor) {
                            cell.baseColor = cell.color || sandPalette[Math.floor(Math.random() * sandPalette.length)];
                        }
                        if (t < 0.5) {
                            let t2 = t / 0.5;
                            cell.color = lerpColor(cell.baseColor, '#ffae42', t2);
                        } else {
                            let t2 = (t - 0.5) / 0.5;
                            cell.color = lerpColor('#ffae42', '#ff3300', t2);
                        }
                    } else {
                        // Normal sand color: only assign if missing or if coming down from glowing
                        if (!cell.baseColor) {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.sand];
                            cell.baseColor = colorArr[Math.floor(Math.random() * colorArr.length)];
                        }
                        cell.color = cell.baseColor;
                    }
                    // Sand movement
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    // If sand just cooled down from glowing, reset baseColor
                    if (cell.temperature < 500 && cell.baseColor && cell.color !== cell.baseColor) {
                        cell.color = cell.baseColor;
                    }
                } else if (cell.type === this.PARTICLE_TYPES.water) {
                    // Water + Fire = Heat up water (check both directions)
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.fire) {
                                // Heat up water instead of immediate transformation
                                cell.temperature += 10; // Heat up water when next to fire
                            }
                            // Fire heats up all adjacent elements
                            //if (neighbor.type !== this.PARTICLE_TYPES.empty && neighbor.type !== this.PARTICLE_TYPES.fire) {
                               // neighbor.temperature += 5; // was 20, now 5°C per frame
                            //}
                        }
                    }
                    if (!this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.oil])) {
                        if (Math.random() < 0.3) {
                            const jitterDir = Math.random() < 0.5 ? -1 : 1;
                            this.tryMove(x, y, [ [jitterDir, 0] ]);
                        }
                    }
                    // Temperature-based transformations
                    if (cell.temperature < 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.ice];
                        cell.type = this.PARTICLE_TYPES.ice;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature >= 100) { // Changed from > to >= for consistency
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                        cell.type = this.PARTICLE_TYPES.steam;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 120; // Set steam temperature
                        cell.lifetime = 600 + Math.floor(Math.random() * 300); // Add lifetime for steam
                    }
                } else if (cell.type === this.PARTICLE_TYPES.ice) {
                    if (cell.temperature > 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.water];
                        cell.type = this.PARTICLE_TYPES.water;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.snow) {
                    // Snow melts at 18°C
                    if (cell.temperature >= 18) {
                        cell.type = this.PARTICLE_TYPES.water;
                        cell.color = this.pickWaterColor(); // Use the same water color function
                        cell.temperature = 20; // Reset temperature to room temperature
                    } else {
                        // Snow falls like sand but slower (60% chance to move)
                        if (Math.random() < 0.6) {
                            this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty]); // Removed water from allowed types
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.steam) {
                    // --- WIKI-LIKE STEAM LOGIC ---
                    if (!cell.lifetime) cell.lifetime = 600 + Math.floor(Math.random() * 300); // dissipate after 600-900 frames
                    cell.lifetime--;
                    if (cell.temperature < 95) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.water];
                        cell.type = this.PARTICLE_TYPES.water;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 20;
                        cell.lifetime = null;
                    } else if (cell.temperature < 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.ice];
                        cell.type = this.PARTICLE_TYPES.ice;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 0;
                        cell.lifetime = null;
                    } else if (cell.lifetime <= 0) {
                        this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                    } else {
                        // Move up even more slowly and swing left/right
                        if (Math.random() < 0.16) { // Only move up 1/6 of the time
                            let dirs = [ [0,-1], [-1,-1], [1,-1] ];
                            for (let i = dirs.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
                            }
                            this.tryMove(x, y, dirs);
                        } else if (Math.random() < 0.5) {
                            this.tryMove(x, y, [ [-1,0], [1,0] ]);
                        }
                    }
                    // --- END WIKI-LIKE LOGIC ---
                } else if (cell.type === this.PARTICLE_TYPES.cloud || cell.type === this.PARTICLE_TYPES.raincloud) {
                    // Shared edge disassembly logic for Cloud and Rain Cloud
                    let isEdgeLeft = false, isEdgeRight = false;
                    // Check left edge
                    if (x === 0 || this.grid[x-1][y].type !== cell.type) isEdgeLeft = true;
                    // Check right edge
                    if (x === this.cols-1 || this.grid[x+1][y].type !== cell.type) isEdgeRight = true;
                    // Only process edge logic if on an edge
                    if (isEdgeLeft || isEdgeRight) {
                        if (!cell.edgeAge) cell.edgeAge = 0;
                        cell.edgeAge++;
                        // Disappear after a long time (e.g., 12000 frames)
                        if (cell.edgeAge > 12000) {
                            this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                            return;
                        }
                        // Movement logic
                        let moveChance = 0.003; // very slow
                        if (isEdgeLeft && Math.random() < moveChance) {
                            // Almost always move left, very rarely right
                            const dir = Math.random() < 0.98 ? -1 : 1;
                            this.tryMove(x, y, [ [dir,0] ]);
                        } else if (isEdgeRight && Math.random() < moveChance) {
                            // Almost always move right, very rarely left
                            const dir = Math.random() < 0.98 ? 1 : -1;
                            this.tryMove(x, y, [ [dir,0] ]);
                        }
                    } else {
                        // Not on edge, reset edgeAge
                        if (cell.edgeAge) cell.edgeAge = 0;
                    }
                    // Rain Cloud-specific logic
                    if (cell.type === this.PARTICLE_TYPES.raincloud) {
                        if (cell.temperature < 0) {
                            // TODO: Turn into Snow Cloud
                        } else if (cell.temperature > 100) {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.cloud];
                            cell.type = this.PARTICLE_TYPES.cloud;
                            cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                            cell.temperature = 110;
                        } else {
                            // 0.05% chance per tick to create Water (rain) below if empty
                            if (Math.random() < 0.0005) {
                                const belowY = y + 1;
                                if (belowY < this.rows && this.grid[x][belowY].type === this.PARTICLE_TYPES.empty) {
                                    this.grid[x][belowY] = {
                                        type: this.PARTICLE_TYPES.water,
                                        color: this.pickWaterColor(),
                                        temperature: 20,
                                        lifetime: null
                                    };
                                }
                            }
                        }
                    } else if (cell.type === this.PARTICLE_TYPES.cloud) {
                        if (cell.temperature < 100) {
                            // Wiki-accurate: Cloud becomes Rain Cloud below 100°C
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.raincloud];
                            cell.type = this.PARTICLE_TYPES.raincloud;
                            cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                            cell.temperature = 70; // Rain Cloud default temp per wiki
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.mud) {
                    // Mud chars to charcoal at high temp
                    if (cell.temperature > 300) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.charcoal];
                        cell.type = this.PARTICLE_TYPES.charcoal;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 100) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.dirt];
                        cell.type = this.PARTICLE_TYPES.dirt;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Mud falls through empty or water (vertical and diagonals, no priority)
                        this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.wetsand) {
                    // Wet sand dries to sand at high temp
                    if (cell.temperature > 100) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.sand];
                        cell.type = this.PARTICLE_TYPES.sand;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Wet sand falls through empty or water (vertical and diagonals, no priority)
                        this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.moltenglass) {
                    // Molten glass flows like a liquid
                    // If it cools below 1500°C, it becomes glass
                    if (cell.temperature < 1500) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.glass];
                        cell.type = this.PARTICLE_TYPES.glass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Vibrant orange/yellow
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltenglass];
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        // Molten glass flows like magma
                        this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.glass) {
                    if (cell.temperature > 1500) {
                        // Glass melts back into molten glass
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltenglass];
                        cell.type = this.PARTICLE_TYPES.moltenglass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 500) {
                        // Interpolate from normal glass to orange/red as it heats
                        let t = Math.min((cell.temperature - 500) / 1200, 1); // 0 to 1 for 500-1700°C
                        let isEdge = false;
                        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                if (this.grid[nx][ny].type !== this.PARTICLE_TYPES.glass) {
                                    isEdge = true;
                                    break;
                                }
                            } else {
                                isEdge = true;
                                break;
                            }
                        }
                        if (isEdge) {
                            cell.color = lerpColor('#89A29F', '#ffae42', t); // border glows
                        } else {
                            cell.color = lerpColor('#648484', '#ffae42', t); // interior glows
                        }
                    } else {
                        // Normal glass color: #648484, with border #89A29F if on edge, and sparkle pattern #7DA098 inside
                        let isEdge = false;
                        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                if (this.grid[nx][ny].type !== this.PARTICLE_TYPES.glass) {
                                    isEdge = true;
                                    break;
                                }
                            } else {
                                isEdge = true;
                                break;
                            }
                        }
                        if (isEdge) {
                            cell.color = '#89A29F';
                        } else if ((x % 6 === y % 6) && (x % 3 < 2)) {
                            cell.color = '#7DA098'; // sparkle pattern color
                        } else {
                            cell.color = '#648484'; // main glass color
                        }
                    }
                    // Glass is immobile
                } else if (cell.type === this.PARTICLE_TYPES.lightning) {
                    // Lightning: short lifespan, moves fast, interacts
                    cell.lifetime--;
                    // Interactions
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.grass) {
                                // Convert grass to fire
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                this.grid[nx][ny] = { 
                                    type: this.PARTICLE_TYPES.fire, 
                                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                    temperature: 100,
                                    lifetime: null
                                };
                            } else if (neighbor.type === this.PARTICLE_TYPES.sand) {
                                // Sand -> Glass
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.glass];
                                neighbor.type = this.PARTICLE_TYPES.glass;
                                neighbor.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                            } else if (neighbor.type === this.PARTICLE_TYPES.water) {
                                // Water -> Steam
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                neighbor.type = this.PARTICLE_TYPES.steam;
                                neighbor.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                            } else if (neighbor.type === this.PARTICLE_TYPES.dirt || neighbor.type === this.PARTICLE_TYPES.mud) {
                                // Dirt/Mud -> ignite (for now, just darken or could add fire)
                                neighbor.temperature += 200;
                            }
                            // Spread lightning to conductive (water, etc.)
                            if ((neighbor.type === this.PARTICLE_TYPES.water || neighbor.type === this.PARTICLE_TYPES.lightning) && Math.random() < 0.5) {
                                this.placeParticle(nx, ny, 'lightning');
                            }
                        }
                    }
                    // Move lightning (random fast direction)
                    const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
                    const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                        if (this.grid[nx][ny].type === this.PARTICLE_TYPES.empty) {
                            this.grid[nx][ny] = { ...cell };
                            this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                        }
                    }
                    // Remove after lifespan
                    if (cell.lifetime <= 0) {
                        this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                    }
                } else if (cell.type === this.PARTICLE_TYPES.grass) {
                    // Grass physics - falls like other elements
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    
                    // Temperature effects
                    if (cell.temperature > 100) {
                        // Turn to dead plant at high temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.deadplant];
                        cell.type = this.PARTICLE_TYPES.deadplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature < -2) {
                        // Turn to dead plant at low temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.deadplant];
                        cell.type = this.PARTICLE_TYPES.deadplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Extremely slow upward growth (0.01% chance each frame)
                        if (Math.random() < 0.0001) {
                            const nx = x;
                            const ny = y - 1;
                            if (ny >= 0 && this.grid[nx][ny].type === this.PARTICLE_TYPES.empty) {
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.grass];
                                this.grid[nx][ny] = { 
                                    type: this.PARTICLE_TYPES.grass, 
                                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                    temperature: cell.temperature,
                                    lifetime: null
                                };
                            }
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.deadplant) {
                    // Dead plant physics - falls like powder
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    // Temperature effects
                    if (cell.temperature > 300) {
                        // Turn to fire at high temperature, create smoke
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                        cell.type = this.PARTICLE_TYPES.fire;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        // Create smoke above if possible
                        if (y > 0 && this.grid[x][y-1].type === this.PARTICLE_TYPES.empty) {
                            const smokeArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.smoke];
                            this.grid[x][y-1] = {
                                type: this.PARTICLE_TYPES.smoke,
                                color: smokeArr[Math.floor(Math.random() * smokeArr.length)],
                                temperature: 20,
                                lifetime: 300 + Math.floor(Math.random() * 200)
                            };
                        }
                    } else if (cell.temperature < -2) {
                        // Turn to frozen plant at low temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.frozenplant];
                        cell.type = this.PARTICLE_TYPES.frozenplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                    // Check for rock interaction at 200-300°C
                    for (const [dx, dy] of [[0,1], [0,-1], [1,0], [-1,0]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.wall || neighbor.type === this.PARTICLE_TYPES.obsidian) {
                                // Wall and obsidian are immobile and don't transfer heat
                                // Wall doesn't melt, but obsidian can turn to lava at high temps
                                if (neighbor.type === this.PARTICLE_TYPES.obsidian && cell.temperature > 1200) {
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.lava];
                                    cell.type = this.PARTICLE_TYPES.lava;
                                    cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                                    cell.temperature = 1200;
                                }
                                break;
                            }
                        }
                    }
                    // High flammability (85%)
                    if (Math.random() < 0.85) {
                        for (const [dx, dy] of [[0,1], [0,-1], [1,0], [-1,0], [1,1], [-1,1], [1,-1], [-1,-1]]) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                const neighbor = this.grid[nx][ny];
                                if (neighbor.type === this.PARTICLE_TYPES.fire) {
                                    // Convert to fire, create smoke
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                    this.grid[nx][ny] = { 
                                        type: this.PARTICLE_TYPES.fire, 
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: 100,
                                        lifetime: null
                                    };
                                    // Create smoke above if possible
                                    if (ny > 0 && this.grid[nx][ny-1].type === this.PARTICLE_TYPES.empty) {
                                        const smokeArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.smoke];
                                        this.grid[nx][ny-1] = {
                                            type: this.PARTICLE_TYPES.smoke,
                                            color: smokeArr[Math.floor(Math.random() * smokeArr.length)],
                                            temperature: 20,
                                            lifetime: 300 + Math.floor(Math.random() * 200)
                                        };
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    // Can turn back to dirt over time (slower than before)
                    if (Math.random() < 0.0005) { // Reduced from 0.001 to 0.0005 (0.05% chance each frame)
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.dirt];
                        cell.type = this.PARTICLE_TYPES.dirt;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.fire) {
                    // Fire physics
                    // Fire + Water = Steam
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.water) {
                                // Both fire and water disappear, steam appears in one of their places
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                const steamCell = { type: this.PARTICLE_TYPES.steam, color: colorArr[Math.floor(Math.random() * colorArr.length)], temperature: 120, lifetime: null };
                                if (Math.random() < 0.5) {
                                    this.grid[x][y] = steamCell;
                                    this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                } else {
                                    this.grid[nx][ny] = steamCell;
                                    this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                }
                                return; // Only react once per update
                            }
                            // Fire heats up all adjacent elements
                            if (neighbor.type !== this.PARTICLE_TYPES.empty && neighbor.type !== this.PARTICLE_TYPES.fire) {
                                neighbor.temperature += 5; // was 20, now 5°C per frame
                            }
                        }
                    }
                    if (Math.random() < 0.1) { // 10% chance to move up
                        if (y > 0 && this.grid[x][y-1].type === this.PARTICLE_TYPES.empty) {
                            this.grid[x][y-1] = { ...cell };
                            this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                        }
                    }
                    // Fire spreads to flammable materials
                    for (const [dx, dy] of [[0,1], [0,-1], [1,0], [-1,0], [1,1], [-1,1], [1,-1], [-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            // Slow fire spread to grass and dead plant (halve the chance)
                            if (neighbor.type === this.PARTICLE_TYPES.grass && Math.random() < 0.004) { // was 0.008
                                neighbor.temperature += 50;
                                if (neighbor.temperature > 100) {
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.deadplant];
                                    this.grid[nx][ny] = { 
                                        type: this.PARTICLE_TYPES.deadplant, 
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: neighbor.temperature,
                                        lifetime: null
                                    };
                                } else {
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                    this.grid[nx][ny] = { 
                                        type: this.PARTICLE_TYPES.fire, 
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: neighbor.temperature,
                                        lifetime: null
                                    };
                                }
                            } else if (neighbor.type === this.PARTICLE_TYPES.deadplant && Math.random() < 0.005) { // was 0.01
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                this.grid[nx][ny] = { 
                                    type: this.PARTICLE_TYPES.fire, 
                                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                    temperature: 100,
                                    lifetime: null
                                };
                            }
                        }
                    }
                    // Fire creates smoke
                    if (Math.random() < 0.01) { // 1% chance
                        const nx = x + (Math.random() < 0.5 ? -1 : 1);
                        const ny = y - 1;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && 
                            this.grid[nx][ny].type === this.PARTICLE_TYPES.empty) {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.smoke];
                            this.grid[nx][ny] = { 
                                type: this.PARTICLE_TYPES.smoke, 
                                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                temperature: 20,
                                lifetime: 300 + Math.floor(Math.random() * 200) // 300-500 frames
                            };
                        }
                    }
                    // Fire eventually burns out (balanced chance)
                    if (Math.random() < 0.01) { // Adjusted from 0.008 to 0.01 (1% chance)
                        this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                    }
                } else if (cell.type === this.PARTICLE_TYPES.smoke) {
                    // Smoke physics
                    if (cell.lifetime) {
                        cell.lifetime--;
                        if (cell.lifetime <= 0) {
                            this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                        } else {
                            // Smoke rises and spreads much more slowly
                            if (Math.random() < 0.1) { // Reduced from 0.3 to 0.1 (10% chance to move up)
                                if (y > 0 && this.grid[x][y-1].type === this.PARTICLE_TYPES.empty) {
                                    this.grid[x][y-1] = { ...cell };
                                    this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                }
                            } else if (Math.random() < 0.15) { // Reduced from 0.2 to 0.15 (15% chance to spread horizontally)
                                const nx = x + (Math.random() < 0.5 ? -1 : 1);
                                if (nx >= 0 && nx < this.cols && this.grid[nx][y].type === this.PARTICLE_TYPES.empty) {
                                    this.grid[nx][y] = { ...cell };
                                    this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                }
                            }
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.charcoal) {
                    // Charcoal physics - falls like powder
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    
                    // Charcoal can burn at high temperatures
                    if (cell.temperature > 400) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                        cell.type = this.PARTICLE_TYPES.fire;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.frozenplant) {
                    // Frozen plant physics - falls like powder
                    this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    
                    // Temperature effects
                    if (cell.temperature > 300) {
                        // Turn to fire at high temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                        cell.type = this.PARTICLE_TYPES.fire;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature < -2) {
                        // Turn to frozen plant at low temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.frozenplant];
                        cell.type = this.PARTICLE_TYPES.frozenplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.lava) {
                    // Lava physics
                    // Lava + Water = Stone/Obsidian
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.water) {
                                // Create steam above
                                if (ny > 0 && this.grid[nx][ny-1].type === this.PARTICLE_TYPES.empty) {
                                    const steamArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                    this.grid[nx][ny-1] = {
                                        type: this.PARTICLE_TYPES.steam,
                                        color: steamArr[Math.floor(Math.random() * steamArr.length)],
                                        temperature: 120,
                                        lifetime: 300 + Math.floor(Math.random() * 200)
                                    };
                                }
                                // Magma cools down significantly when touching water
                                cell.temperature = Math.max(cell.temperature - 400, 20); // Much larger temperature drop
                                // Remove the water
                                this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                
                                // If cooled enough, convert to basalt/stone immediately
                                if (cell.temperature < 800) {
                                    const newType = Math.random() < 0.3 ? this.PARTICLE_TYPES.obsidian : this.PARTICLE_TYPES.wall;
                                    const colorArr = this.PARTICLE_COLORS[newType];
                                    this.grid[x][y] = {
                                        type: newType,
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: 20,
                                        lifetime: null
                                    };
                                    return; // Skip the rest of the update for this cell
                                }
                            }
                        }
                    }

                    // Heat up surrounding cells (reduced heat transfer)
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                                if (neighbor.type !== this.PARTICLE_TYPES.empty) {
                                    neighbor.temperature = Math.min(neighbor.temperature + 0.2, 1000); // Reduced heat transfer
                                    
                                    // Melt certain elements
                                    if (neighbor.temperature > 100) {
                                        if (neighbor.type === this.PARTICLE_TYPES.ice) {
                                            this.grid[nx][ny] = {
                                                type: this.PARTICLE_TYPES.water,
                                                color: this.pickWaterColor(),
                                                temperature: 20,
                                                lifetime: null
                                            };
                                        } else if (neighbor.type === this.PARTICLE_TYPES.wall || neighbor.type === this.PARTICLE_TYPES.obsidian) {
                                            // Wall and obsidian are immobile and don't transfer heat
                                            // Wall doesn't melt, but obsidian can turn to lava at high temps
                                            if (neighbor.type === this.PARTICLE_TYPES.obsidian && cell.temperature > 1200) {
                                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.lava];
                                                cell.type = this.PARTICLE_TYPES.lava;
                                                cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                                                cell.temperature = 1200;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Magma movement (more fluid-like but slower in water)
                    const directions = [
                        [0, 1],  // down
                        [-1, 1], // down-left
                        [1, 1],  // down-right
                        [-1, 0], // left
                        [1, 0]   // right
                    ];
                    
                    // Move more frequently but slower when near water
                    if (Math.random() < (hasWaterNeighbor ? 0.35 : 0.5)) { // Increased from 0.2/0.4 to 0.35/0.5
                        // Prioritize downward movement when not near water
                        if (!hasWaterNeighbor && Math.random() < 0.7) { // 70% chance to prioritize down
                            this.tryMove(x, y, [[0, 1], [-1, 1], [1, 1]], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                        } else {
                            this.tryMove(x, y, directions, [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                        }
                    }
                    
                    // Cool down over time (faster cooling)
                    if (Math.random() < 0.005) { // Increased from 0.001 to 0.005 (0.5% chance to cool)
                        cell.temperature = Math.max(cell.temperature - 5, 20); // Cool by 5 degrees instead of 1
                    }
                    
                    // Convert to basalt if cooled enough (at 800°C as per wiki)
                    if (cell.temperature < 800) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.basalt];
                        this.grid[x][y] = {
                            type: this.PARTICLE_TYPES.basalt,
                            color: colorArr[Math.floor(Math.random() * colorArr.length)],
                            temperature: 20,
                            lifetime: null
                        };
                    }
                } else if (cell.type === this.PARTICLE_TYPES.basalt) {
                    // Basalt is a sturdy powder that falls straight down
                    if (cell.temperature > 1262.5) {
                        // Melt into magma at high temperature
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma];
                        cell.type = this.PARTICLE_TYPES.magma;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 1200;
                    } else {
                        // Fall straight down only
                        this.tryMove(x, y, [[0,1]], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.wall || cell.type === this.PARTICLE_TYPES.obsidian) {
                    // Wall and obsidian are immobile and don't transfer heat
                    // Wall doesn't melt, but obsidian can turn to lava at high temps
                    if (cell.type === this.PARTICLE_TYPES.obsidian && cell.temperature > 1200) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.lava];
                        cell.type = this.PARTICLE_TYPES.lava;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 1200;
                    }
                } else if (cell.type === this.PARTICLE_TYPES.magma) {
                    // Check for water interaction first
                    let hasWaterNeighbor = false;
                    let hasMagmaNeighbor = false;
                    let waterCount = 0;
                    
                    // Check neighbors for water and other magma
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.water) {
                                hasWaterNeighbor = true;
                                waterCount++;
                                // Create steam above
                                if (ny > 0 && this.grid[nx][ny-1].type === this.PARTICLE_TYPES.empty) {
                                    const steamArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                    this.grid[nx][ny-1] = {
                                        type: this.PARTICLE_TYPES.steam,
                                        color: steamArr[Math.floor(Math.random() * steamArr.length)],
                                        temperature: 120,
                                        lifetime: 300 + Math.floor(Math.random() * 200)
                                    };
                                }
                                // Remove the water
                                this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                
                                // Cool down the magma significantly
                                cell.temperature = Math.max(cell.temperature - 400, 800); // Increased cooling from 200 to 400
                            } else if (neighbor.type === this.PARTICLE_TYPES.magma) {
                                hasMagmaNeighbor = true;
                            }
                        }
                    }

                    // If surrounded by water, convert to basalt immediately
                    if (waterCount >= 3) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.basalt];
                        this.grid[x][y] = {
                            type: this.PARTICLE_TYPES.basalt,
                            color: colorArr[Math.floor(Math.random() * colorArr.length)],
                            temperature: 20,
                            lifetime: null
                        };
                        return; // Skip the rest of the update for this cell
                    }

                    // Heat up surrounding cells (more natural heat transfer)
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                const neighbor = this.grid[nx][ny];
                                if (neighbor.type !== this.PARTICLE_TYPES.empty) {
                                    // More gradual heat transfer
                                    const heatTransfer = 0.5;
                                    neighbor.temperature = Math.min(neighbor.temperature + heatTransfer, 1200);
                                    
                                    // Melt certain elements
                                    if (neighbor.temperature > 100) {
                                        if (neighbor.type === this.PARTICLE_TYPES.ice) {
                                            this.grid[nx][ny] = {
                                                type: this.PARTICLE_TYPES.water,
                                                color: this.pickWaterColor(),
                                                temperature: 20,
                                                lifetime: null
                                            };
                                        } else if (neighbor.type === this.PARTICLE_TYPES.wall || neighbor.type === this.PARTICLE_TYPES.obsidian) {
                                            // Wall and obsidian are immobile and don't transfer heat
                                            // Wall doesn't melt, but obsidian can turn to lava at high temps
                                            if (neighbor.type === this.PARTICLE_TYPES.obsidian && cell.temperature > 1200) {
                                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.lava];
                                                cell.type = this.PARTICLE_TYPES.lava;
                                                cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                                                cell.temperature = 1200;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Magma movement (more fluid-like but slower in water)
                    const directions = [
                        [0, 1],  // down
                        [-1, 1], // down-left
                        [1, 1],  // down-right
                        [-1, 0], // left
                        [1, 0]   // right
                    ];
                    
                    // Move more frequently but slower when near water
                    if (Math.random() < (hasWaterNeighbor ? 0.35 : 0.5)) { // Increased from 0.2/0.4 to 0.35/0.5
                        // Prioritize downward movement when not near water
                        if (!hasWaterNeighbor && Math.random() < 0.7) { // 70% chance to prioritize down
                            this.tryMove(x, y, [[0, 1], [-1, 1], [1, 1]], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                        } else {
                            this.tryMove(x, y, directions, [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                        }
                    }
                    
                    // More gradual cooling with neighbor influence
                    if (Math.random() < 0.003) {
                        // Cool faster if touching water or if neighbors are cooler
                        let coolingRate = 2;
                        if (hasWaterNeighbor) {
                            coolingRate = 8; // Increased from 5 to 8
                        } else if (hasMagmaNeighbor) {
                            // Check if any magma neighbors are cooler
                            for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                    const neighbor = this.grid[nx][ny];
                                    if (neighbor.type === this.PARTICLE_TYPES.magma && neighbor.temperature < cell.temperature) {
                                        coolingRate = 3;
                                        break;
                                    }
                                }
                            }
                        }
                        cell.temperature = Math.max(cell.temperature - coolingRate, 20);
                    }
                    
                    // Convert to basalt if cooled enough, but only if not touching water
                    // Also check if any neighbors are already basalt to encourage uniform cooling
                    let hasBasaltNeighbor = false;
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            if (this.grid[nx][ny].type === this.PARTICLE_TYPES.basalt) {
                                hasBasaltNeighbor = true;
                                break;
                            }
                        }
                    }
                    
                    if (cell.temperature < 800 && !hasWaterNeighbor && (hasBasaltNeighbor || Math.random() < 0.1)) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.basalt];
                        this.grid[x][y] = {
                            type: this.PARTICLE_TYPES.basalt,
                            color: colorArr[Math.floor(Math.random() * colorArr.length)],
                            temperature: 20,
                            lifetime: null
                        };
                    }
                } else if (cell.type === this.PARTICLE_TYPES.oil) {
                    // Oil is more viscous: only move with 25% chance per frame
                    if (Math.random() < 0.25) {
                        if (!this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ])) {
                            if (Math.random() < 0.3) {
                                const jitterDir = Math.random() < 0.5 ? -1 : 1;
                                this.tryMove(x, y, [ [jitterDir, 0] ]);
                            }
                        }
                    }
                    // Oil slow shimmer: extremely rarely swap color (weighted, user browns, new weights)
                    if (Math.random() < 0.001) { // 0.1% chance per frame
                        const r = Math.random();
                        if (r < 0.85) cell.color = '#420D04';
                        else if (r < 0.90) cell.color = '#4C140A';
                        else if (r < 0.94) cell.color = '#541C14';
                        else if (r < 0.97) cell.color = '#4C1C0C';
                        else cell.color = '#340404';
                    }
                } else if (cell.type === this.PARTICLE_TYPES.dirtywater) {
                    // Dirty water sinks through water extremely slowly (density 1005 vs 1000)
                    if (Math.random() < 0.01) { // Only 1% chance to try sinking each frame
                        if (!this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water])) {
                            if (Math.random() < 0.02) { // Very slow horizontal movement
                                const jitterDir = Math.random() < 0.5 ? -1 : 1;
                                this.tryMove(x, y, [ [jitterDir, 0] ]);
                            }
                        }
                    }
                    // Temperature changes like water
                    if (cell.temperature < 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.ice];
                        cell.type = this.PARTICLE_TYPES.ice;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 105) { // Boils at 105°C like in wiki
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                        cell.type = this.PARTICLE_TYPES.steam;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.raincloud) {
                    // Rain Cloud behavior (wiki):
                    if (cell.temperature < 0) {
                        // TODO: Turn into Snow Cloud
                        // For now, just stay as Rain Cloud
                    } else if (cell.temperature > 100) {
                        // Becomes Cloud
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.cloud];
                        cell.type = this.PARTICLE_TYPES.cloud;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 110;
                    } else {
                        // 0.05% chance per tick to create Water (rain) below if empty
                        if (Math.random() < 0.0005) {
                            const belowY = y + 1;
                            if (belowY < this.rows && this.grid[x][belowY].type === this.PARTICLE_TYPES.empty) {
                                this.grid[x][belowY] = {
                                    type: this.PARTICLE_TYPES.water,
                                    color: this.pickWaterColor(),
                                    temperature: 20,
                                    lifetime: null
                                };
                            }
                        } else {
                            // Wispy edge drift (very rare)
                            let isEdge = false;
                            for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                                const nx = x + dx, ny = y + dy;
                                if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                    if (this.grid[nx][ny].type !== this.PARTICLE_TYPES.raincloud) {
                                        isEdge = true;
                                        break;
                                    }
                                } else {
                                    isEdge = true;
                                    break;
                                }
                            }
                            if (isEdge && Math.random() < 0.003) { // 0.3% chance for edge to drift
                                const dir = Math.random() < 0.5 ? -1 : 1;
                                this.tryMove(x, y, [ [dir,0] ]);
                            }
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.moltenglass) {
                    // Molten glass flows like a liquid
                    // If it cools below 1500°C, it becomes glass
                    if (cell.temperature < 1500) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.glass];
                        cell.type = this.PARTICLE_TYPES.glass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Vibrant orange/yellow
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltenglass];
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        // Molten glass flows like magma
                        this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water, this.PARTICLE_TYPES.steam]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.glass) {
                    if (cell.temperature > 1500) {
                        // Glass melts back into molten glass
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.moltenglass];
                        cell.type = this.PARTICLE_TYPES.moltenglass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 500) {
                        // Interpolate from normal glass to orange/red as it heats
                        let t = Math.min((cell.temperature - 500) / 1200, 1); // 0 to 1 for 500-1700°C
                        let isEdge = false;
                        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                if (this.grid[nx][ny].type !== this.PARTICLE_TYPES.glass) {
                                    isEdge = true;
                                    break;
                                }
                            } else {
                                isEdge = true;
                                break;
                            }
                        }
                        if (isEdge) {
                            cell.color = lerpColor('#89A29F', '#ffae42', t); // border glows
                        } else {
                            cell.color = lerpColor('#648484', '#ffae42', t); // interior glows
                        }
                    } else {
                        // Normal glass color: #648484, with border #89A29F if on edge, and sparkle pattern #7DA098 inside
                        let isEdge = false;
                        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                if (this.grid[nx][ny].type !== this.PARTICLE_TYPES.glass) {
                                    isEdge = true;
                                    break;
                                }
                            } else {
                                isEdge = true;
                                break;
                            }
                        }
                        if (isEdge) {
                            cell.color = '#89A29F';
                        } else if ((x % 6 === y % 6) && (x % 3 < 2)) {
                            cell.color = '#7DA098'; // sparkle pattern color
                        } else {
                            cell.color = '#648484'; // main glass color
                        }
                    }
                    // Glass is immobile
                } else if (cell.type === this.PARTICLE_TYPES.rock) {
                    // Rock behavior
                    if (cell.temperature >= 950) {
                        // Rock melts into Magma at 950°C
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma];
                        cell.type = this.PARTICLE_TYPES.magma;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Rock movement - falls like sand but slower
                        if (Math.random() < 0.7) { // 70% chance to move each frame
                            this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.snow) {
                    // Snow melts at 18°C
                    if (cell.temperature >= 18) {
                        cell.type = this.PARTICLE_TYPES.water;
                        cell.color = this.pickWaterColor(); // Use the same water color function
                        cell.temperature = 20; // Reset temperature to room temperature
                    } else {
                        // Snow falls like sand but slower (60% chance to move)
                        if (Math.random() < 0.6) {
                            this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty]); // Removed water from allowed types
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.gravel) {
                    // Gravel melts into Magma at 950°C
                    if (cell.temperature >= 950) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma];
                        cell.type = this.PARTICLE_TYPES.magma;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        // Check for Dirty Water filtering
                        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                const neighbor = this.grid[nx][ny];
                                if (neighbor.type === this.PARTICLE_TYPES.dirtywater) {
                                    // Convert Dirty Water to clean Water
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.water];
                                    this.grid[nx][ny] = {
                                        type: this.PARTICLE_TYPES.water,
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: neighbor.temperature,
                                        lifetime: null
                                    };
                                }
                            }
                        }
                        // Gravel falls like sand but slower (70% chance to move)
                        if (Math.random() < 0.7) {
                            this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                        }
                    }
                } else if (cell.type === this.PARTICLE_TYPES.cactus) {
                    // Realistic cactus: main stem up, short branches, flowers only on main stem tips
                    if (Math.random() < 0.01) { // 1% chance to grow (faster)
                        if (!cell.isBranch && y > 0 && this.grid[x][y-1].type === this.PARTICLE_TYPES.empty) {
                            // Main stem grows up
                            // Only make a flower if this is the tip (no cactus above)
                            const isTip = (y-1 === 0 || this.grid[x][y-2].type !== this.PARTICLE_TYPES.cactus);
                            const makeFlower = isTip && Math.random() < 0.10;
                            const makeSpike = !makeFlower && Math.random() < 0.10;
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.cactus];
                            this.grid[x][y-1] = {
                                type: this.PARTICLE_TYPES.cactus,
                                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                temperature: cell.temperature,
                                lifetime: null,
                                edgeAge: null,
                                isBranch: false,
                                isFlower: makeFlower,
                                isSpike: makeSpike
                            };
                            // 10% chance to spawn a branch (left or right)
                            if (Math.random() < 0.10) {
                                const dir = Math.random() < 0.5 ? -1 : 1;
                                const nx = x + dir;
                                if (nx >= 0 && nx < this.cols && this.grid[nx][y].type === this.PARTICLE_TYPES.empty) {
                                    // Branch meta: track branch age (how many cells grown)
                                    this.grid[nx][y] = {
                                        type: this.PARTICLE_TYPES.cactus,
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: cell.temperature,
                                        lifetime: null,
                                        edgeAge: null,
                                        isBranch: true,
                                        branchAge: 1 // start at 1
                                    };
                                }
                            }
                        } else if (cell.isBranch) {
                            // Branches grow sideways for 1-3 cells, then up once, then stop
                            let maxBranch = cell.branchMax || (2 + Math.floor(Math.random() * 2)); // 2-3
                            let age = cell.branchAge || 1;
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.cactus];
                            if (age < maxBranch) {
                                // Continue sideways
                                const dir = (cell.lastDir !== undefined) ? cell.lastDir : (Math.random() < 0.5 ? -1 : 1);
                                const nx = x + dir;
                                if (nx >= 0 && nx < this.cols && this.grid[nx][y].type === this.PARTICLE_TYPES.empty) {
                                    this.grid[nx][y] = {
                                        type: this.PARTICLE_TYPES.cactus,
                                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                        temperature: cell.temperature,
                                        lifetime: null,
                                        edgeAge: null,
                                        isBranch: true,
                                        branchAge: age + 1,
                                        branchMax: maxBranch,
                                        lastDir: dir
                                    };
                                }
                            } else if (y > 0 && this.grid[x][y-1].type === this.PARTICLE_TYPES.empty) {
                                // Go up once, then stop
                                this.grid[x][y-1] = {
                                    type: this.PARTICLE_TYPES.cactus,
                                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                    temperature: cell.temperature,
                                    lifetime: null,
                                    edgeAge: null,
                                    isBranch: true,
                                    branchAge: age + 1,
                                    branchMax: maxBranch,
                                    lastDir: cell.lastDir
                                };
                            }
                        }
                    }
                    // Temperature effects
                    if (cell.temperature < -5) {
                        // Freeze at very low temperatures
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.frozenplant];
                        cell.type = this.PARTICLE_TYPES.frozenplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 250) {
                        // Die at high temperatures
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.deadplant];
                        cell.type = this.PARTICLE_TYPES.deadplant;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                }
            }
        }
    }

    tryMove(x, y, directions, allowedTypes = [this.PARTICLE_TYPES.empty]) {
        for (const [dx, dy] of this.shuffleArray(directions)) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                const target = this.grid[nx][ny];
                if (allowedTypes.includes(target.type)) {
                    // Check if Gravel is being smashed (moving into a non-empty cell)
                    if (this.grid[x][y].type === this.PARTICLE_TYPES.gravel && target.type !== this.PARTICLE_TYPES.empty) {
                        // Convert Gravel to Sand
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.sand];
                        this.grid[x][y] = {
                            type: this.PARTICLE_TYPES.sand,
                            color: colorArr[Math.floor(Math.random() * colorArr.length)],
                            temperature: this.grid[x][y].temperature,
                            lifetime: null
                        };
                        return true;
                    }
                    // Normal swap
                    [this.grid[x][y], this.grid[nx][ny]] = [this.grid[nx][ny], this.grid[x][y]];
                    return true;
                }
            }
        }
        return false;
    }

    shuffleArray(array) {
        // Fisher-Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cell = this.grid[x][y];
                if (cell.type !== this.PARTICLE_TYPES.empty) {
                    // Custom cactus rendering for flowers and spikes
                    if (cell.type === this.PARTICLE_TYPES.cactus) {
                        if (cell.isFlower) {
                            // Pink/magenta flower (matching screenshot)
                            this.ctx.fillStyle = ['#e23d8e', '#d13a7a', '#c72e6b', '#ff4fa3'][Math.floor(Math.random()*4)];
                        } else if (cell.isSpike) {
                            // White/yellow spike (matching screenshot)
                            this.ctx.fillStyle = ['#fffbe0', '#fff7b2', '#f7e9a0', '#fff'][Math.floor(Math.random()*4)];
                        } else {
                            this.ctx.fillStyle = cell.color;
                        }
                    } else {
                        this.ctx.fillStyle = cell.color;
                    }
                    this.ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
        // Draw lightning path if active
        if (this.lightningTimer > 0 && this.lightningPath.length > 1) {
            this.ctx.save();
            let grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            grad.addColorStop(0, '#e6f7ff');
            grad.addColorStop(1, '#b5e2ff');
            this.ctx.strokeStyle = grad;
            this.ctx.shadowColor = '#b5e2ff';
            this.ctx.shadowBlur = 12;
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            let [startX, startY] = this.lightningPath[0];
            this.ctx.moveTo((startX + 0.5) * this.cellSize, (startY + 0.5) * this.cellSize);
            for (let i = 1; i < this.lightningPath.length; i++) {
                let [lx, ly] = this.lightningPath[i];
                this.ctx.lineTo((lx + 0.5) * this.cellSize, (ly + 0.5) * this.cellSize);
            }
            this.ctx.stroke();
            this.ctx.restore();
            this.lightningTimer--;
        }
        // Draw brush preview
        if (this.isMouseDown || this.mouseX < 0 || this.mouseY < 0) return;
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(
            (this.mouseX - this.brushSize) * this.cellSize,
            (this.mouseY - this.brushSize) * this.cellSize,
            (this.brushSize * 2 + 1) * this.cellSize,
            (this.brushSize * 2 + 1) * this.cellSize
        );
        this.ctx.restore();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    resetGrid() {
        this.grid = new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null).map(() => ({ type: 0, color: null, temperature: 20, lifetime: null, edgeAge: null })));
    }

    spawnSteamCluster(x, y) {
        let clusterSize = 3 + Math.floor(Math.random() * 5); // 3-7 pixels
        let positions = [[x, y]];
        for (let i = 1; i < clusterSize; i++) {
            let [px, py] = positions[Math.floor(Math.random() * positions.length)];
            let dir = [ [0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1] ][Math.floor(Math.random() * 8)];
            let nx = px + dir[0], ny = py + dir[1];
            positions.push([nx, ny]);
        }
        // Optionally add a few isolated pixels
        if (Math.random() < 0.3) {
            positions.push([x + Math.floor(Math.random()*5)-2, y + Math.floor(Math.random()*5)-2]);
        }
        for (let [sx, sy] of positions) {
            if (sx >= 0 && sx < this.cols && sy >= 0 && sy < this.rows) {
                // Only place if empty or already steam
                if (this.grid[sx][sy].type === this.PARTICLE_TYPES.empty || this.grid[sx][sy].type === this.PARTICLE_TYPES.steam) {
                    let colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                    let color = colorArr ? colorArr[Math.floor(Math.random() * colorArr.length)] : null;
                    this.grid[sx][sy] = { type: this.PARTICLE_TYPES.steam, color, temperature: 150, lifetime: null };
                }
            }
        }
    }

    updateInfoDisplay() {
        if (this.mouseX >= 0 && this.mouseY >= 0 && this.mouseX < this.width && this.mouseY < this.height) {
            const index = this.mouseY * this.width + this.mouseX;
            const element = this.grid[index];
            const temp = this.temperatureGrid[index];
            if (element) {
                this.infoDisplay.textContent = `ELEMENT: ${element} | TEMP: ${temp}°C`;
            } else {
                this.infoDisplay.textContent = 'ELEMENT: EMPTY | TEMP: 0°C';
            }
        } else {
            this.infoDisplay.textContent = 'ELEMENT: EMPTY | TEMP: 0°C';
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 

function lerpColor(a, b, t) {
    // a, b: hex color strings, t: 0-1
    const ah = a.replace('#', '');
    const bh = b.replace('#', '');
    const ar = parseInt(ah.substring(0,2), 16), ag = parseInt(ah.substring(2,4), 16), ab = parseInt(ah.substring(4,6), 16);
    const br = parseInt(bh.substring(0,2), 16), bg = parseInt(bh.substring(2,4), 16), bb = parseInt(bh.substring(4,6), 16);
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `#${rr.toString(16).padStart(2,'0')}${rg.toString(16).padStart(2,'0')}${rb.toString(16).padStart(2,'0')}`;
} 