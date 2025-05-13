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
            17: 'Stone',
            18: 'Obsidian',
            19: 'Magma',
            20: 'Oil',
            21: 'Dirty Water',
            22: 'Basalt',
            23: 'Cloud',
            24: 'Rain Cloud'
        };
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.infoDisplay = document.getElementById('infoDisplay');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
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
            stone: 17,
            obsidian: 18,
            magma: 19,
            oil: 20,
            dirtywater: 21,
            basalt: 22,
            cloud: 23,
            raincloud: 24
        };
        // Particle colors
        this.PARTICLE_COLORS = {
            0: null,
            1: ['rgb(60, 40, 20)', 'rgb(80, 50, 25)', 'rgb(70, 45, 18)', 'rgb(90, 60, 30)', 'rgb(65, 48, 28)', 'rgb(75, 55, 35)'], // dirt
            2: ['#ffe39f', '#ffe08a', '#ffe7b3', '#ffe4a1', '#ffe6a8'], // sand
            3: ['#047AF2', '#1D84F4', '#1184F4'], // water (all light blue)
            4: ['#e0f7fa', '#b2ebf2', '#b3e5fc', '#e1f5fe'], // ice
            5: ['#b3cfe3', '#a3bed6', '#c7e3f7', '#b8d8f7'], // steam (solid, wiki-like)
            6: ['#362217', '#442C24', '#2C140C', '#3C2C24', '#443424'], // mud (user specified browns)
            7: ['#e0d7b3', '#d2c295', '#c2b280', '#bfa76a'], // wet sand
            8: ['#b2ebf2', '#e0f7fa', '#c1f0f6', '#aeeeee'], // glass
            9: ['#fff700', '#fffbe0', '#ffe066', '#fff'], // lightning
            10: ['#4CAF50', '#45a049', '#3d8b40', '#357935', '#2e672a'], // grass
            11: ['#8B4513', '#7a3d10', '#6b3510', '#5c2e0f'], // dead plant
            12: ['#ff4500', '#ff6a00', '#ff8c00', '#ffa500', '#ff7f00'], // fire
            13: ['#404040', '#303030', '#202020', '#101010'], // smoke (much darker grays)
            14: ['#1a1a1a', '#262626', '#333333', '#404040'], // charcoal
            15: ['#b2f7e6', '#a0e6d6', '#c2fff7', '#d0fff0'], // frozen plant (icy green/blue)
            16: ['#ff4500', '#ff5500', '#ff6500', '#ff7500', '#ff8500'], // lava
            17: ['#808080', '#707070', '#606060', '#505050'], // stone
            18: ['#2d2d2d', '#1a1a1a', '#000000'], // obsidian
            19: ['#ffb347', '#ff8300', '#ff5e13', '#ff2e00', '#ff7e00'], // magma (hotter, more orange/red)
            20: ['#420D04', '#4C140A', '#541C14', '#4C1C0C', '#340404'], // oil (user provided browns)
            21: ['#2e8b57', '#3cb371', '#20b2aa', '#48d1cc'], // dirty water (greenish-blue)
            22: ['#808080', '#707070', '#606060', '#505050'], // basalt
            23: ['#d3d3d3', '#c0c0c0', '#e0e0e0', '#f0f0f0'], // cloud (light gray)
            24: ['#888888', '#666666', '#999999', '#555555'] // rain cloud (dark gray)
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
            this.mouseX = Math.floor((e.clientX - rect.left) / this.cellSize);
            this.mouseY = Math.floor((e.clientY - rect.top) / this.cellSize);
            
            // Update info display
            if (this.mouseX >= 0 && this.mouseX < this.cols && this.mouseY >= 0 && this.mouseY < this.rows) {
                const cell = this.grid[this.mouseX][this.mouseY];
                if (cell.type !== this.PARTICLE_TYPES.empty) {
                    this.infoDisplay.style.display = 'block';
                    this.infoDisplay.textContent = `${this.PARTICLE_NAMES[cell.type]} - ${Math.round(cell.temperature)}°C`;
                } else {
                    this.infoDisplay.style.display = 'none';
                }
            } else {
                this.infoDisplay.style.display = 'none';
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
            this.infoDisplay.style.display = 'none';
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
            this.grid[x][y] = { type: this.PARTICLE_TYPES[type], color, temperature, lifetime };
        }
    }

    update() {
        // Always update infoDisplay with current cell info
        if (this.mouseX >= 0 && this.mouseX < this.cols && this.mouseY >= 0 && this.mouseY < this.rows) {
            const cell = this.grid[this.mouseX][this.mouseY];
            if (cell.type !== this.PARTICLE_TYPES.empty) {
                this.infoDisplay.style.display = 'block';
                this.infoDisplay.textContent = `${this.PARTICLE_NAMES[cell.type]} - ${Math.round(cell.temperature)}°C`;
            } else {
                this.infoDisplay.style.display = 'none';
            }
        } else {
            this.infoDisplay.style.display = 'none';
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
                            // Wiki-accurate: +2 to +5°C, or +2 to +32°C with Shift
                            let delta = this.isShiftDown ? (2 + Math.floor(Math.random() * 31)) : (2 + Math.floor(Math.random() * 4));
                            this.grid[x][y].temperature += delta;
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
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cell = this.grid[x][y];
                if (cell.type !== this.PARTICLE_TYPES.empty) {
                    let sum = cell.temperature;
                    let count = 1;
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type !== this.PARTICLE_TYPES.empty) {
                                sum += neighbor.temperature;
                                count++;
                            }
                        }
                    }
                    // Even slower heat spread
                    cell.temperature += (sum/count - cell.temperature) * 0.01; // was 0.03, now 0.01
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
                } else if (cell.type === this.PARTICLE_TYPES.sand) {
                    // Sand melts to glass at high temp
                    if (cell.temperature > 1700) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.glass];
                        cell.type = this.PARTICLE_TYPES.glass;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else {
                        this.tryMove(x, y, [ [0,1], [-1,1], [1,1] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.water]);
                    }
                } else if (cell.type === this.PARTICLE_TYPES.water) {
                    // Water + Fire = Steam (check both directions)
                    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            const neighbor = this.grid[nx][ny];
                            if (neighbor.type === this.PARTICLE_TYPES.fire) {
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
                            } else if (neighbor.type === this.PARTICLE_TYPES.oil) {
                                // Water + Oil = Dirty Water (extremely slow transformation)
                                if (Math.random() < 0.0001) { // 0.01% chance per frame to transform (extremely slow)
                                    const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.dirtywater];
                                    cell.type = this.PARTICLE_TYPES.dirtywater;
                                    cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                                }
                            }
                        }
                    }
                    if (!this.tryMove(x, y, [ [0,1], [-1,1], [1,1], [-1,0], [1,0] ], [this.PARTICLE_TYPES.empty, this.PARTICLE_TYPES.oil])) {
                        if (Math.random() < 0.3) {
                            const jitterDir = Math.random() < 0.5 ? -1 : 1;
                            this.tryMove(x, y, [ [jitterDir, 0] ]);
                        }
                    }
                    if (cell.temperature < 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.ice];
                        cell.type = this.PARTICLE_TYPES.ice;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    } else if (cell.temperature > 100) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.steam];
                        cell.type = this.PARTICLE_TYPES.steam;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    }
                } else if (cell.type === this.PARTICLE_TYPES.ice) {
                    if (cell.temperature > 0) {
                        const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.water];
                        cell.type = this.PARTICLE_TYPES.water;
                        cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
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
                } else if (cell.type === this.PARTICLE_TYPES.glass) {
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
                            if (neighbor.type === this.PARTICLE_TYPES.rock && 
                                cell.temperature >= 200 && cell.temperature <= 300) {
                                // Convert to charcoal
                                const colorArr = this.PARTICLE_COLORS[this.PARTICLE_TYPES.charcoal];
                                cell.type = this.PARTICLE_TYPES.charcoal;
                                cell.color = colorArr[Math.floor(Math.random() * colorArr.length)];
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
                                    const newType = Math.random() < 0.3 ? this.PARTICLE_TYPES.obsidian : this.PARTICLE_TYPES.stone;
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
                                        } else if (neighbor.type === this.PARTICLE_TYPES.stone) {
                                            this.grid[nx][ny] = {
                                                type: this.PARTICLE_TYPES.magma,
                                                color: this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma][Math.floor(Math.random() * this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma].length)],
                                                temperature: 1200,
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
                } else if (cell.type === this.PARTICLE_TYPES.stone || cell.type === this.PARTICLE_TYPES.obsidian) {
                    // Stone and obsidian are immobile but can be heated
                    if (cell.temperature > 1200) {
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
                                        } else if (neighbor.type === this.PARTICLE_TYPES.stone) {
                                            this.grid[nx][ny] = {
                                                type: this.PARTICLE_TYPES.magma,
                                                color: this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma][Math.floor(Math.random() * this.PARTICLE_COLORS[this.PARTICLE_TYPES.magma].length)],
                                                temperature: 1200,
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
                    // Swap
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
                    // Oil: use assigned color
                    this.ctx.fillStyle = cell.color;
                    this.ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                    // Temperature overlay
                    if (cell.temperature < 0) {
                        this.ctx.fillStyle = 'rgba(0,150,255,0.25)';
                        this.ctx.fillRect(
                            x * this.cellSize,
                            y * this.cellSize,
                            this.cellSize,
                            this.cellSize
                        );
                    } else if (cell.temperature > 700) {
                        this.ctx.fillStyle = 'rgba(255,120,0,0.13)'; // very subtle, glowy orange
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
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 