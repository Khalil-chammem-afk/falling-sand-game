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
            16: 'Wall',
            17: 'Magma',
            18: 'Oil',
            19: 'Dirty Water',
            20: 'Basalt',
            21: 'Cloud',
            22: 'Rain Cloud',
            23: 'Molten Glass',
            24: 'Rock',
            25: 'Snow',
            26: 'Gravel',
            27: 'Molten Dirt',
            28: 'Cactus',
            29: 'Plasma',
            30: 'Mudstone'
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
            wall: 16,
            magma: 17,
            oil: 18,
            dirtywater: 19,
            basalt: 20,
            cloud: 21,
            raincloud: 22,
            moltenglass: 23,
            rock: 24,
            snow: 25,
            gravel: 26,
            moltendirt: 27,
            cactus: 28,
            plasma: 29,
            mudstone: 30
        };
        // Particle colors
        this.PARTICLE_COLORS = {
            0: null,
            1: ['#3C2814', '#503219', '#462D12', '#5A3C1E', '#41301C', '#4B3723'], // dirt
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
            16: ['#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#848484', '#848484', '#848484', '#848484'], // wall
            17: ['#ffb347', '#ff8300', '#ff5e13', '#ff2e00', '#ff7e00'], // magma
            18: ['#420D04', '#4C140A', '#541C14', '#4C1C0C', '#340404'], // oil
            19: ['#2e8b57', '#3cb371', '#20b2aa', '#48d1cc'], // dirty water
            20: ['#808080', '#707070', '#606060', '#505050'], // basalt
            21: ['#d3d3d3', '#c0c0c0', '#e0e0e0', '#f0f0f0'], // cloud
            22: ['#888888', '#666666', '#999999', '#555555'], // rain cloud
            23: ['#ffb347', '#ff8300', '#ff5e13', '#ff2e00', '#ff7e00'], // molten glass
            24: ['#808080', '#707070', '#606060', '#505050', '#404040'], // rock
            25: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'], // snow
            26: ['#c0c0c0', '#b0b0b0', '#a0a0a0', '#909090'], // gravel
            27: ['#ffb347', '#ff8300', '#ff5e13', '#ff2e00', '#ff7e00'], // molten dirt
            28: ['#2e8b57', '#3cb371', '#20b2aa', '#48d1cc'], // cactus
            29: ['#9b4dca', '#ffb3ff', '#fff0fa', '#e0b3ff', '#c77dff'], // plasma (purple/pink/white)
            30: ['#3C2814', '#503219', '#462D12', '#5A3C1E', '#41301C', '#4B3723'] // mudstone
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
            wall: 0, // Wall doesn't transfer heat
            water: 0.8, // High conductivity
            steam: 0.3, // Medium conductivity
            smoke: 0.2, // Low conductivity
            fire: 0.4, // Medium conductivity
            plasma: 0.9, // Very high conductivity
            magma: 0.7, // High conductivity
            ice: 0.6, // Medium-high conductivity
            glass: 0.3, // Low-medium conductivity
            moltenglass: 0.5, // Medium conductivity
            metal: 0.8, // High conductivity
            sand: 0.2, // Low conductivity
            dirt: 0.2, // Low conductivity
            grass: 0.2, // Low conductivity
            rock: 0.3, // Low-medium conductivity
            basalt: 0.4, // Medium conductivity
            mudstone: 0.25, // Low-medium conductivity
            default: 0.1 // Default conductivity for other materials
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
                if (this.selectedParticle === 'lightning') return; // Prevent changing brush size for lightning
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
            if (this.selectedParticle === 'lightning') return; // Prevent changing brush size for lightning
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
                        // Apply lightning temperature to struck cell
                        this.grid[cx][cy].temperature = 30000;
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
            if (type === 'plasma') {
                temperature = 7065; // Set initial temperature for plasma as per wiki
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
            if (this.selectedParticle === 'lightning') this.brushSize = 1;
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

        // Gentle, moderately increased heat transfer: 1 pass per frame
        const passes = 1;
        for (let pass = 0; pass < passes; pass++) {
          for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
              const cell = this.grid[x][y];
              if (cell.type === this.PARTICLE_TYPES.empty) continue;
              let typeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === cell.type);
              let cellConduct = this.CONDUCTIVITY[typeName] ?? this.CONDUCTIVITY.default;
              if (cellConduct === 0) continue;

              for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]])) {
                const nx = x + dx, ny = y + dy;
                if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) continue;
                const neighbor = this.grid[nx][ny];
                if (neighbor.type === this.PARTICLE_TYPES.empty) continue;
                let nTypeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === neighbor.type);
                let nConduct = this.CONDUCTIVITY[nTypeName] ?? this.CONDUCTIVITY.default;
                if (nConduct === 0) continue;

                let baseRate = 0.08;
                let conduct = Math.max(cellConduct, nConduct);
                let tempDiff = neighbor.temperature - cell.temperature;
                let rate = baseRate;
                if (Math.abs(tempDiff) > 2000) rate *= 2.0;
                else if (Math.abs(tempDiff) > 1000) rate *= 1.5;

                let diff = tempDiff * rate * conduct;
                cell.temperature += diff;
                neighbor.temperature -= diff;
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
                    for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0]])) {
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
                            }
                        }
                    }
                }
                // Sand absorbs water and becomes wetsand (like dirt/mud)
                if (cell.type === this.PARTICLE_TYPES.sand) {
                    for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0]])) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.water) {
                                // Sand absorbs water and becomes wetsand
                                const wetSandColor = this.PARTICLE_COLORS[this.PARTICLE_TYPES.wetsand];
                                cell.type = this.PARTICLE_TYPES.wetsand;
                                cell.color = wetSandColor[Math.floor(Math.random() * wetSandColor.length)];
                                // Remove the water
                                this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                break; // Only absorb one water per tick
                            }
                        }
                    }
                }
            }
        }

        // Wetsand seeps down into sand below (like mud/dirt)
        for (let x = 0; x < this.cols; x++) {
            for (let y = this.rows - 2; y >= 0; y--) { // from second-to-last row up
                const cell = this.grid[x][y];
                if (cell.type === this.PARTICLE_TYPES.wetsand) {
                    const belowCell = this.grid[x][y + 1];
                    if (belowCell.type === this.PARTICLE_TYPES.sand) {
                        // If this wetsand was just created (has no age property)
                        if (!cell.age) {
                            // Quick initial movement when wetsand is first created
                            const temp = this.grid[x][y + 1];
                            this.grid[x][y + 1] = this.grid[x][y];
                            this.grid[x][y] = temp;
                            // Set age to start slow seeping phase
                            this.grid[x][y + 1].age = 1;
                        } else {
                            // ALMOST IMPERCEPTIBLY slow seeping through sand (0.01% chance)
                            if (Math.random() < 0.001) {
                                const temp = this.grid[x][y + 1];
                                this.grid[x][y + 1] = this.grid[x][y];
                                this.grid[x][y] = temp;
                                // Preserve age for continued slow movement
                                this.grid[x][y + 1].age = this.grid[x][y].age + 1;
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
                    // Cool to mudstone at ≤ 1100°C
                    if (cell.temperature <= 1100) {
                        // 90% chance to become Mudstone, 10% chance to become Rock
                        if (Math.random() < 0.95) {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.mudstone];
                            cell.type = this.PARTICLE_TYPES.mudstone;
                            cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        } else {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.rock];
                            cell.type = this.PARTICLE_TYPES.rock;
                            cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        }
                        // cell.temperature = 20; // Removed this line to maintain temperature
                        delete cell.baseColor;
                    }
                } else if (cell.type === this.PARTICLE_TYPES.mudstone) {
                    // Mudstone acts like a sturdy powder, falls unless supported left and right by solid elements (including itself).

                    // Check if the space below is empty
                    if (y < this.rows - 1 && this.grid[x][y + 1].type === this.PARTICLE_TYPES.empty) {

                        let supportedLeft = false;
                        // Check left neighbor if it exists
                        if (x > 0) {
                            const leftCellType = this.grid[x - 1][y].type;
                            // Check if the left cell is a solid (using a simplified check based on known solids) or Mudstone
                            if (leftCellType === this.PARTICLE_TYPES.wall ||
                                leftCellType === this.PARTICLE_TYPES.rock ||
                                leftCellType === this.PARTICLE_TYPES.basalt ||
           
                                leftCellType === this.PARTICLE_TYPES.glass ||
                                leftCellType === this.PARTICLE_TYPES.mudstone) {
                                supportedLeft = true;
                            }
                        }

                        let supportedRight = false;
                         // Check right neighbor if it exists
                        if (x < this.cols - 1) {
                            const rightCellType = this.grid[x + 1][y].type;
                             // Check if the right cell is a solid (using a simplified check based on known solids) or Mudstone
                             if (rightCellType === this.PARTICLE_TYPES.wall ||
                                 rightCellType === this.PARTICLE_TYPES.rock ||
                                 rightCellType === this.PARTICLE_TYPES.basalt ||
                                 rightCellType === this.PARTICLE_TYPES.glass ||
                                 rightCellType === this.PARTICLE_TYPES.mudstone) {
                                supportedRight = true;
                            }
                        }

                        // If NOT supported both left AND right by solid, the mudstone falls
                        if (!(supportedLeft && supportedRight)) {
                             // Try to move down, prioritizing straight down, then diagonals
                            this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty]);
                        }
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
                    for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]])) {
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
                    // Check if there's dirt below
                    if (y < this.rows - 1) {
                        const belowCell = this.grid[x][y + 1];
                        if (belowCell.type === this.PARTICLE_TYPES.dirt) {
                            // Check if this mud was just created (has no age property)
                            if (!cell.age) {
                                // Quick initial movement when mud is first created
                                const temp = this.grid[x][y + 1];
                                this.grid[x][y + 1] = this.grid[x][y];
                                this.grid[x][y] = temp;
                                // Set age to start slow seeping phase
                                this.grid[x][y + 1].age = 1;
                            } else {
                                // ALMOST IMPERCEPTIBLY slow seeping through dirt (0.01% chance)
                                if (Math.random() < 0.001) {
                                    const temp = this.grid[x][y + 1];
                                    this.grid[x][y + 1] = this.grid[x][y];
                                    this.grid[x][y] = temp;
                                    // Preserve age for continued slow movement
                                    this.grid[x][y + 1].age = this.grid[x][y].age + 1;
                                }
                            }
                        }
                    }
                    // Mud chars to charcoal at high temp
                    if (cell.temperature > 300) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.charcoal];
                        cell.type = this.PARTICLE_TYPES.charcoal;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature >= 100) { // Harden to Mudstone at 100°C
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.mudstone];
                        cell.type = this.PARTICLE_TYPES.mudstone;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 100; // Set temperature upon hardening
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
                    
                    // Apply high temperature to self
                    cell.temperature = 30000; // Lightning temperature
                    
                    // Interactions based on conductivity
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            
                            // Skip empty cells and other lightning
                            if (neighbor.type === this.PARTICLE_TYPES.empty || 
                                neighbor.type === this.PARTICLE_TYPES.lightning) continue;
                            
                            // Calculate conductivity-based heat transfer
                            const conductivity = this.CONDUCTIVITY[this.PARTICLE_NAMES[neighbor.type]] || this.CONDUCTIVITY.default;
                            const heatTransfer = 30000 * conductivity; // Lightning temperature * conductivity
                            
                            // Apply heat to neighbor
                            neighbor.temperature += heatTransfer;
                            
                            // Spread lightning based on conductivity
                            if (Math.random() < conductivity * 0.8) { // 80% of conductivity value
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
                            if (neighbor.type === this.PARTICLE_TYPES.wall) {
                                // Wall is immobile and doesn't transfer heat
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
                    // Fire + Water = Steam
                    for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]])) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.water) {
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                                const steamCell = { type: this.PARTICLE_TYPES.steam, color: colorArr[Math.floor(Math.random() * colorArr.length)], temperature: 120, lifetime: null };
                                if (Math.random() < 0.5) {
                                    this.grid[x][y] = steamCell;
                                    this.grid[nx][ny] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                } else {
                                    this.grid[nx][ny] = steamCell;
                                    this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                                }
                                return;
                            }
                        }
                    }
                    // Fire spreads to flammable materials (unbiased)
                    const flammableTypes = [
                        this.PARTICLE_TYPES.dirt,
                        this.PARTICLE_TYPES.sand,
                        this.PARTICLE_TYPES.grass,
                        this.PARTICLE_TYPES.deadplant,
                        this.PARTICLE_TYPES.oil,
                        this.PARTICLE_TYPES.charcoal,
                        this.PARTICLE_TYPES.frozenplant,
                        this.PARTICLE_TYPES.cactus,
                        this.PARTICLE_TYPES.mud,
                        this.PARTICLE_TYPES.wetsand,
                        this.PARTICLE_TYPES.snow,
                        this.PARTICLE_TYPES.gravel,
                        this.PARTICLE_TYPES.rock,
                        this.PARTICLE_TYPES.cloud,
                        this.PARTICLE_TYPES.raincloud,
                        this.PARTICLE_TYPES.smoke,
                        this.PARTICLE_TYPES.steam
                    ];
                    const igniteChances = {
                        [this.PARTICLE_TYPES.grass]: 0.008,
                        [this.PARTICLE_TYPES.deadplant]: 0.01,
                        [this.PARTICLE_TYPES.oil]: 0.02,
                        [this.PARTICLE_TYPES.charcoal]: 0.005,
                        [this.PARTICLE_TYPES.cactus]: 0.008,
                        [this.PARTICLE_TYPES.wood]: 0.006,
                        [this.PARTICLE_TYPES.dirt]: 0.001,
                        [this.PARTICLE_TYPES.sand]: 0.001,
                        [this.PARTICLE_TYPES.mud]: 0.001,
                        [this.PARTICLE_TYPES.wetsand]: 0.001,
                        [this.PARTICLE_TYPES.snow]: 0.002,
                        [this.PARTICLE_TYPES.gravel]: 0.001,
                        [this.PARTICLE_TYPES.rock]: 0.0005,
                        [this.PARTICLE_TYPES.cloud]: 0.0005,
                        [this.PARTICLE_TYPES.raincloud]: 0.0005,
                        [this.PARTICLE_TYPES.smoke]: 0.0005,
                        [this.PARTICLE_TYPES.steam]: 0.0005,
                        [this.PARTICLE_TYPES.frozenplant]: 0.008
                    };
                    for (const [dx, dy] of this.shuffleArray([[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]])) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (flammableTypes.includes(neighbor.type)) {
                                const chance = igniteChances[neighbor.type] || 0.001;
                                if (Math.random() < chance) {
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
                    }
                    // Fire creates smoke
                    if (Math.random() < 0.01) {
                        const nx = x + (Math.random() < 0.5 ? -1 : 1);
                        const ny = y - 1;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && this.grid[nx][ny].type === this.PARTICLE_TYPES.empty) {
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.smoke];
                            this.grid[nx][ny] = {
                                type: this.PARTICLE_TYPES.smoke,
                                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                temperature: 20,
                                lifetime: 300 + Math.floor(Math.random() * 200)
                            };
                        }
                    }
                    // Fire eventually burns out
                    if (Math.random() < 0.01) {
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
                }  else if (cell.type === this.PARTICLE_TYPES.basalt) {
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
                }  else if (cell.type === this.PARTICLE_TYPES.magma) {
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
                        if (Math.random() < 0.8) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.basalt];
                        this.grid[x][y] = {
                            type: this.PARTICLE_TYPES.basalt,
                            color: colorArr[Math.floor(Math.random() * colorArr.length)],
                            temperature: 20,
                            lifetime: null
                        };
                    }
                        else{
                            const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.rock];
                            this.grid[x][y] = {
                                type: this.PARTICLE_TYPES.rock,
                                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                temperature: 20,
                                lifetime: null
                            };
                        }
                    } 
                }else if (cell.type === this.PARTICLE_TYPES.oil) {
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
                    if (Math.random() < 0.005) { // Only 0.5% chance to try sinking each frame
                        if (!this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water])) {
                            if (Math.random() < 0.01) { // Very slow horizontal movement
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
                } else if (cell.type === this.PARTICLE_TYPES.plasma) {
                    // Set default temperature if not set
                    if (typeof cell.temperature !== 'number' || isNaN(cell.temperature)) cell.temperature = 7065;
                    // 0.5% chance to disappear each tick (was 1%)
                    if (Math.random() < 0.005) {
                        this.grid[x][y] = { type: this.PARTICLE_TYPES.empty, color: null, temperature: 20, lifetime: null };
                        continue;
                    }
                    // Always ignite flammable neighbors
                    const flammableTypes = [
                        this.PARTICLE_TYPES.dirt,
                        this.PARTICLE_TYPES.sand,
                        this.PARTICLE_TYPES.grass,
                        this.PARTICLE_TYPES.deadplant,
                        this.PARTICLE_TYPES.oil,
                        this.PARTICLE_TYPES.charcoal,
                        this.PARTICLE_TYPES.frozenplant,
                        this.PARTICLE_TYPES.cactus,
                        this.PARTICLE_TYPES.mud,
                        this.PARTICLE_TYPES.wetsand,
                        this.PARTICLE_TYPES.snow,
                        this.PARTICLE_TYPES.gravel,
                        this.PARTICLE_TYPES.rock,
                        this.PARTICLE_TYPES.cloud,
                        this.PARTICLE_TYPES.raincloud,
                        this.PARTICLE_TYPES.smoke,
                        this.PARTICLE_TYPES.steam,
                        this.PARTICLE_TYPES.fire
                    ];
                    // Set transformation thresholds for direct ignition
                    const igniteThresholds = {
                        [this.PARTICLE_TYPES.sand]: 1701,
                        [this.PARTICLE_TYPES.dirt]: 1201,
                        [this.PARTICLE_TYPES.grass]: 101,
                        [this.PARTICLE_TYPES.deadplant]: 301,
                        [this.PARTICLE_TYPES.oil]: 401,
                        [this.PARTICLE_TYPES.charcoal]: 401,
                        [this.PARTICLE_TYPES.frozenplant]: 301,
                        [this.PARTICLE_TYPES.cactus]: 251,
                        [this.PARTICLE_TYPES.mud]: 301,
                        [this.PARTICLE_TYPES.wetsand]: 101,
                        [this.PARTICLE_TYPES.snow]: 19,
                        [this.PARTICLE_TYPES.gravel]: 951,
                        [this.PARTICLE_TYPES.rock]: 951,
                        [this.PARTICLE_TYPES.cloud]: 101,
                        [this.PARTICLE_TYPES.raincloud]: 101,
                        [this.PARTICLE_TYPES.smoke]: 101,
                        [this.PARTICLE_TYPES.steam]: 101,
                        [this.PARTICLE_TYPES.fire]: 101
                    };
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (flammableTypes.includes(neighbor.type)) {
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                                const threshold = igniteThresholds[neighbor.type] || 101;
                                this.grid[nx][ny] = {
                                    type: this.PARTICLE_TYPES.fire,
                                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                                    temperature: Math.max(neighbor.temperature, threshold),
                                    lifetime: null
                                };
                            }
                        }
                    }
                    // Color cycling for glowing effect
                    if (!cell.baseColor) {
                        const plasmaPalette = this.PARTICLE_COLORS[this.PARTICLE_TYPES.plasma];
                        cell.baseColor = cell.color || plasmaPalette[Math.floor(Math.random() * plasmaPalette.length)];
                    }
                    // Cycle color for glow (30% chance)
                    if (Math.random() < 0.3) {
                        const plasmaPalette = this.PARTICLE_COLORS[this.PARTICLE_TYPES.plasma];
                        cell.color = plasmaPalette[Math.floor(Math.random() * plasmaPalette.length)];
                    }
                    // Gas-like movement: mostly up, sometimes sideways (slowed down further)
                    let moved = false;
                    if (Math.random() < 0.08) { // 8% chance to move upward per tick
                        moved = this.tryMove(x, y, [[0,-1], [-1,-1], [1,-1]], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.steam, this.PARTICLE_TYPES.smoke]);
                    }
                    if (!moved && Math.random() < 0.04) { // 4% chance to move sideways per tick
                        moved = this.tryMove(x, y, [[-1,0], [1,0]], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.steam, this.PARTICLE_TYPES.smoke]);
                    }
                    // Cool to fire at ≤6000°C
                    if (cell.temperature <= 6000) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.fire];
                        cell.type = this.PARTICLE_TYPES.fire;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                        cell.temperature = 100;
                    }
                }
            }
        }
        // Water + Oil → Dirty Water (with random chance, wiki accurate)
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cell = this.grid[x][y];
                if (cell.type === this.PARTICLE_TYPES.water) {
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.oil) {
                                if (Math.random() < 0.001) { // 0.1% chance per frame
                                    const dirtyWaterColor = this.PARTICLE_COLORS[this.PARTICLE_TYPES.dirtywater];
                                    cell.type = this.PARTICLE_TYPES.dirtywater;
                                    cell.color = dirtyWaterColor[Math.floor(Math.random() * dirtyWaterColor.length)];
                                    break; // Only one reaction per frame
                                }
                            }
                        }
                    }
                }
            }
        }

        // For each cell (not empty)
        for (let x = 0; x < this.cols; x++) {
          for (let y = 0; y < this.rows; y++) {
            const cell = this.grid[x][y];
            if (cell.type === this.PARTICLE_TYPES.empty) continue;
            let typeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === cell.type);
            let cellConduct = this.CONDUCTIVITY[typeName] ?? this.CONDUCTIVITY.default;
            if (cellConduct === 0) continue;

            // For each neighbor
            for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) continue;
              const neighbor = this.grid[nx][ny];
              if (neighbor.type === this.PARTICLE_TYPES.empty) continue;
              let nTypeName = Object.keys(this.PARTICLE_TYPES).find(key => this.PARTICLE_TYPES[key] === neighbor.type);
              let nConduct = this.CONDUCTIVITY[nTypeName] ?? this.CONDUCTIVITY.default;
              if (nConduct === 0) continue;

              // Diffusive transfer
              let baseRate = 0.18; // much higher than before
              let conduct = Math.max(cellConduct, nConduct);
              let tempDiff = neighbor.temperature - cell.temperature;
              let rate = baseRate;

              // Optional: burst for extreme differences
              if (Math.abs(tempDiff) > 1000) rate *= 2;
              else if (Math.abs(tempDiff) > 500) rate *= 1.5;

              let diff = tempDiff * rate * conduct;
              cell.temperature += diff;
              neighbor.temperature -= diff; // Ensures conservation
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
                    // Plus shape for gases, fire, and plasma
                    if ([
                        this.PARTICLE_TYPES.steam,
                        this.PARTICLE_TYPES.smoke,
                        this.PARTICLE_TYPES.cloud,
                        this.PARTICLE_TYPES.raincloud,
                        this.PARTICLE_TYPES.plasma,
                        this.PARTICLE_TYPES.fire
                    ].includes(cell.type)) {
                        const cs = this.cellSize;
                        const x0 = x * cs, y0 = y * cs;
                        // Center (fully opaque)
                        this.ctx.globalAlpha = 1.0;
                        this.ctx.fillRect(x0, y0, cs, cs);
                        // Arms (30% opacity)
                        this.ctx.globalAlpha = 0.30;
                        // Up
                        this.ctx.fillRect(x0, y0 - cs, cs, cs);
                        // Down
                        this.ctx.fillRect(x0, y0 + cs, cs, cs);
                        // Left
                        this.ctx.fillRect(x0 - cs, y0, cs, cs);
                        // Right
                        this.ctx.fillRect(x0 + cs, y0, cs, cs);
                        this.ctx.globalAlpha = 1.0; // Reset alpha
                    } else {
                        this.ctx.fillRect(
                            x * this.cellSize,
                            y * this.cellSize,
                            this.cellSize,
                            this.cellSize
                        );
                    }
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