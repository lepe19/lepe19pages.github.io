// MÓDULO DE AUTENTICACIÓN - AGREGAR AL INICIO DEL ARCHIVO

// Base de datos de usuarios
const users = [
    { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
    { username: 'usuario', password: 'user123', name: 'Usuario Estándar', role: 'user' },
    { username: 'auditor', password: 'audit123', name: 'Auditor', role: 'auditor' }
];

// Función para verificar autenticación
function checkAuth() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (loggedInUser && sessionExpiry && new Date().getTime() < parseInt(sessionExpiry)) {
        showMainContent(JSON.parse(loggedInUser));
        return true;
    } else {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('sessionExpiry');
        showLoginModal();
        return false;
    }
}

// Mostrar modal de login
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    
    if (loginModal && mainContent) {
        loginModal.classList.remove('hidden');
        mainContent.classList.add('hidden');
        document.getElementById('username').focus();
    }
}

// Mostrar contenido principal
function showMainContent(user) {
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    
    if (loginModal && mainContent) {
        loginModal.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        const currentUserElement = document.getElementById('currentUser');
        if (currentUserElement) {
            currentUserElement.textContent = user.name;
        }
        
        const expiryTime = new Date().getTime() + (8 * 60 * 60 * 1000);
        localStorage.setItem('sessionExpiry', expiryTime.toString());
    }
}

// Inicializar sistema de autenticación
function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (!loginForm) return;
    
    // Manejar envío del formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            if (loginError) loginError.classList.add('hidden');
            
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            if (rememberMe) {
                const expiryTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
                localStorage.setItem('sessionExpiry', expiryTime.toString());
            } else {
                const expiryTime = new Date().getTime() + (8 * 60 * 60 * 1000);
                localStorage.setItem('sessionExpiry', expiryTime.toString());
            }
            
            showMainContent(user);
        } else {
            if (errorMessage) errorMessage.textContent = 'Credenciales incorrectas. Intente nuevamente.';
            if (loginError) loginError.classList.remove('hidden');
            
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });
    
    // Manejar cierre de sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('sessionExpiry');
            showLoginModal();
            if (loginForm) loginForm.reset();
        });
    }
    
    // Alternar visibilidad de contraseña
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
    
    // Verificar autenticación al cargar la página
    checkAuth();
}
// FIN MÓDULO DE AUTENTICACIÓN

document.addEventListener('DOMContentLoaded', function () {
    // INICIALIZAR SISTEMA DE AUTENTICACIÓN - AGREGAR ESTA LÍNEA
    initAuth();
    // Mostrar fecha actual en el encabezado
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Referencias a elementos
    const jsonFileInput = document.getElementById('jsonFileInput');
    const transformJsonBtn = document.getElementById('transformJsonBtn');
    const jsonPreview = document.getElementById('jsonPreview');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
    const jsonDropZone = document.getElementById('jsonDropZone');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const validationResults = document.getElementById('validationResults');
    const processingSection = document.getElementById('processingSection');
    const transformResults = document.getElementById('transformResults');
    const resetProcessBtn = document.getElementById('resetProcessBtn');
    const fileList = document.getElementById('fileList');
    const folderStructure = document.getElementById('folderStructure');
    const transformCount = document.getElementById('transformCount');
    const fileCount = document.getElementById('fileCount');
    const errorCount = document.getElementById('errorCount');
    const transformationsList = document.getElementById('transformationsList');
    const fileSelector = document.getElementById('fileSelector');
    const currentFileName = document.getElementById('currentFileName');
    const errorDetailsSection = document.getElementById('errorDetailsSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const jsonTransformSection = document.getElementById('jsonTransformSection');
    const dashboardLink = document.getElementById('dashboardLink');
    const transformLink = document.getElementById('transformLink');
    const startTransformBtn = document.getElementById('startTransformBtn');
    const refreshStatsBtn = document.getElementById('refreshStatsBtn');
    const newProcessBtn = document.getElementById('newProcessBtn');
    const recentFilesList = document.getElementById('recentFilesList');
    const historyList = document.getElementById('historyList');
    const fileEditor = document.getElementById('fileEditor');
    const fileContentEditor = document.getElementById('fileContentEditor');
    const currentFilePath = document.getElementById('currentFilePath');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    // Elementos del dashboard
    const dashboardFileCount = document.getElementById('dashboardFileCount');
    const dashboardTransformCount = document.getElementById('dashboardTransformCount');
    const dashboardErrorCount = document.getElementById('dashboardErrorCount');
    const dashboardAvgTime = document.getElementById('dashboardAvgTime');
    
    let jsonFiles = [];
    let folderTree = {};
    let transformedFiles = [];
    let totalTransformations = 0;
    let totalErrors = 0;
    let processingQueue = [];
    let isProcessing = false;
    let processStartTime = 0;
    let processHistory = [];
    let currentlyEditingFile = null;

    // Inicializar navegación
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        jsonTransformSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        dashboardLink.classList.add('active');
        transformLink.classList.remove('active');
    });

    transformLink.addEventListener('click', function(e) {
        e.preventDefault();
        dashboardSection.classList.add('hidden');
        jsonTransformSection.classList.remove('hidden');
        dashboardLink.classList.remove('active');
        transformLink.classList.add('active');
    });

    startTransformBtn.addEventListener('click', function() {
        dashboardSection.classList.add('hidden');
        jsonTransformSection.classList.remove('hidden');
        dashboardLink.classList.remove('active');
        transformLink.classList.add('active');
    });

    newProcessBtn.addEventListener('click', function() {
        resetProcess();
        dashboardSection.classList.add('hidden');
        jsonTransformSection.classList.remove('hidden');
        dashboardLink.classList.remove('active');
        transformLink.classList.add('active');
    });

    // Configurar event listeners
    setupEventListeners();

    function setupEventListeners() {
        // Selección manual de archivos
        jsonDropZone.addEventListener('click', () => jsonFileInput.click());
        
        // Accesibilidad: activar con tecla Enter o espacio
        jsonDropZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                jsonFileInput.click();
                e.preventDefault();
            }
        });
        
        // Cambio de archivos
        jsonFileInput.addEventListener('change', handleFileInputChange);
        
        // Transformar JSON
        transformJsonBtn.addEventListener('click', transformJsonFiles);
        
        // Descargar todos los archivos
        downloadAllBtn.addEventListener('click', () => downloadTransformedFiles('all'));
        
        // Descargar archivo seleccionado
        downloadSelectedBtn.addEventListener('click', () => downloadTransformedFiles('selected'));
        
        // Cambiar archivo de vista previa
        fileSelector.addEventListener('change', updateJsonPreview);
        
        // Reiniciar proceso
        resetProcessBtn.addEventListener('click', resetProcess);
        
        // Drag and drop para JSON
        jsonDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            jsonDropZone.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
        });
        
        jsonDropZone.addEventListener('dragleave', () => {
            jsonDropZone.style.backgroundColor = '';
        });
        
        jsonDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            jsonDropZone.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                const files = Array.from(e.dataTransfer.files).filter(file => 
                    file.name.toLowerCase().endsWith('.json') || 
                    file.name.toLowerCase().endsWith('.pdf') || 
                    file.name.toLowerCase().endsWith('.xml')
                );
                
                if (files.length > 0) {
                    jsonFiles = [...jsonFiles, ...files];
                    renderFileList();
                    renderFolderStructure();
                    
                    // Validar tipos de usuario después de cargar
                    validateUserTypesOnLoad();
                    
                    // Animación de confirmación
                    jsonDropZone.innerHTML = `
                        <i class="fas fa-check-circle text-success"></i>
                        <p>${files.length} archivo(s) cargado(s)</p>
                        <p class="small text-muted">Haz clic para agregar más</p>
                    `;
                    setTimeout(() => {
                        jsonDropZone.innerHTML = `
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Arrastra y suelta tus archivos JSON, PDF o XML aquí</p>
                            <p class="small text-muted">o haz clic para seleccionar</p>
                        `;
                    }, 2000);
                } else {
                    alert('Por favor, selecciona archivos JSON, PDF o XML válidos');
                }
            }
        });
        
        // Actualizar estadísticas
        refreshStatsBtn.addEventListener('click', updateDashboardStats);
        
        // Manejar edición de archivos
        saveFileBtn.addEventListener('click', saveFileChanges);
        cancelEditBtn.addEventListener('click', cancelFileEdit);
    }

    function handleFileInputChange() {
        if (jsonFileInput.files.length) {
            const files = Array.from(jsonFileInput.files);
            jsonFiles = [...jsonFiles, ...files];
            renderFileList();
            renderFolderStructure();
            // Validar tipos de usuario después de cargar
            validateUserTypesOnLoad();
        }
    }

    function renderFolderStructure() {
        if (jsonFiles.length === 0) {
            folderStructure.innerHTML = '<div class="text-muted">No se han seleccionado archivos</div>';
            return;
        }
        
        folderTree = {};
        
        // Construir estructura de carpetas
        jsonFiles.forEach(file => {
            const path = file.webkitRelativePath || file.name;
            const parts = path.split('/');
            let currentLevel = folderTree;
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (!currentLevel[part]) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part];
            }
        });
        
        // Renderizar estructura
        folderStructure.innerHTML = '<div class="mb-2"><strong>Estructura de carpetas:</strong></div>';
        renderTree(folderTree, folderStructure);
    }
    
    function renderTree(tree, container, path = '') {
        for (const key in tree) {
            if (Object.keys(tree[key]).length === 0) {
                // Es un archivo
                const fileEl = document.createElement('div');
                fileEl.className = 'file-item';
                fileEl.innerHTML = `
                    ${key}
                    <div class="file-actions">
                        <button class="btn btn-sm btn-outline-primary edit-file-btn" data-path="${path}${key}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-file-btn" data-path="${path}${key}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(fileEl);
                
                // Agregar event listeners para los botones
                fileEl.querySelector('.edit-file-btn').addEventListener('click', (e) => {
                    const filePath = e.target.closest('button').getAttribute('data-path');
                    editFile(filePath);
                });
                
                fileEl.querySelector('.delete-file-btn').addEventListener('click', (e) => {
                    const filePath = e.target.closest('button').getAttribute('data-path');
                    deleteFile(filePath);
                });
            } else {
                // Es una carpeta
                const folderEl = document.createElement('div');
                folderEl.className = 'folder-item folder-expanded';
                folderEl.innerHTML = `
                    <span class="folder-toggle">
                        <i class="fas fa-folder-open"></i> ${key}
                    </span>
                    <div class="folder-actions">
                        <button class="btn btn-sm btn-outline-danger delete-folder-btn" data-path="${path}${key}/">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                const folderContents = document.createElement('div');
                folderContents.className = 'folder-contents';
                
                container.appendChild(folderEl);
                container.appendChild(folderContents);
                
                // Renderizar contenido de la carpeta
                renderTree(tree[key], folderContents, `${path}${key}/`);
                
                // Agregar event listener para expandir/colapsar
                folderEl.querySelector('.folder-toggle').addEventListener('click', (e) => {
                    const isExpanded = folderEl.classList.contains('folder-expanded');
                    if (isExpanded) {
                        folderEl.classList.remove('folder-expanded');
                        folderEl.classList.add('folder-collapsed');
                        e.target.querySelector('i').className = 'fas fa-folder';
                    } else {
                        folderEl.classList.remove('folder-collapsed');
                        folderEl.classList.add('folder-expanded');
                        e.target.querySelector('i').className = 'fas fa-folder-open';
                    }
                });
                
                // Agregar event listener para eliminar carpeta
                folderEl.querySelector('.delete-folder-btn').addEventListener('click', (e) => {
                    const folderPath = e.target.closest('button').getAttribute('data-path');
                    deleteFolder(folderPath);
                });
            }
        }
    }

    function editFile(filePath) {
    const file = jsonFiles.find(f => 
        (f.webkitRelativePath || f.name) === filePath
    );
    
    if (!file) {
        alert('Archivo no encontrado');
        return;
    }
    
    currentlyEditingFile = file;
    currentFilePath.textContent = filePath;
    fileContentEditor.readOnly = false;
    
    if (file.name.toLowerCase().endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Validar JSON antes de mostrarlo
                JSON.parse(e.target.result);
                fileContentEditor.value = e.target.result;
                fileEditor.classList.remove('hidden');
            } catch (error) {
                fileContentEditor.value = `Error: El archivo no contiene JSON válido\n\n${error.message}\n\n${e.target.result}`;
                fileContentEditor.readOnly = true;
                fileEditor.classList.remove('hidden');
            }
        };
        reader.onerror = function() {
            fileContentEditor.value = `Error al leer el archivo ${file.name}`;
            fileContentEditor.readOnly = true;
            fileEditor.classList.remove('hidden');
        };
        reader.readAsText(file);
    } else {
        fileContentEditor.value = `El archivo ${file.name} no es editable (solo se pueden editar archivos JSON)`;
        fileContentEditor.readOnly = true;
        fileEditor.classList.remove('hidden');
    }
}

    function saveFileChanges() {
    if (!currentlyEditingFile) return;
    
    if (currentlyEditingFile.name.toLowerCase().endsWith('.json')) {
        try {
            JSON.parse(fileContentEditor.value); // Validar que sea JSON válido
            
            // Crear un nuevo archivo con el contenido editado preservando todas las propiedades
            const blob = new Blob([fileContentEditor.value], { type: 'application/json' });
            const newFile = new File([blob], currentlyEditingFile.name, {
                type: 'application/json',
                lastModified: Date.now(),
                webkitRelativePath: currentlyEditingFile.webkitRelativePath || undefined
            });
            
            // Copiar propiedades adicionales del archivo original
            Object.entries(currentlyEditingFile).forEach(([key, value]) => {
                if (!(key in newFile) && key !== 'webkitRelativePath') {
                    try {
                        newFile[key] = value;
                    } catch (e) {
                        console.warn(`No se pudo copiar propiedad ${key} al nuevo archivo`);
                    }
                }
            });
            
            // Reemplazar el archivo en el array manteniendo su posición
            const index = jsonFiles.findIndex(f => 
                (f.webkitRelativePath || f.name) === (currentlyEditingFile.webkitRelativePath || currentlyEditingFile.name)
            );
            
            if (index !== -1) {
                jsonFiles[index] = newFile;
            }
            
            // Mostrar mensaje de éxito
            alert('Archivo guardado correctamente');
            cancelFileEdit();
            renderFolderStructure();
        } catch (e) {
            alert('Error: El contenido no es un JSON válido');
            console.error(e);
        }
    } else {
        alert('Solo se pueden editar archivos JSON');
    }
}

    function cancelFileEdit() {
        fileEditor.classList.add('hidden');
        currentlyEditingFile = null;
        fileContentEditor.value = '';
        fileContentEditor.readOnly = false;
        currentFilePath.textContent = '';
    }

    function deleteFile(filePath) {
        if (confirm(`¿Estás seguro de que deseas eliminar el archivo ${filePath}?`)) {
            jsonFiles = jsonFiles.filter(f => 
                (f.webkitRelativePath || f.name) !== filePath
            );
            renderFileList();
            renderFolderStructure();
        }
    }

    function deleteFolder(folderPath) {
        if (confirm(`¿Estás seguro de que deseas eliminar la carpeta ${folderPath} y todo su contenido?`)) {
            jsonFiles = jsonFiles.filter(f => 
                !(f.webkitRelativePath || f.name).startsWith(folderPath)
            );
            renderFileList();
            renderFolderStructure();
        }
    }

    function renderFileList() {
        if (jsonFiles.length === 0) {
            fileList.innerHTML = '<div class="alert alert-info">No hay archivos seleccionados</div>';
            fileCount.textContent = '0';
            return;
        }
        
        fileList.innerHTML = '';
        fileCount.textContent = jsonFiles.length;
        
        jsonFiles.forEach((file, index) => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            
            let fileIcon;
            if (file.name.toLowerCase().endsWith('.json')) {
                fileIcon = '<i class="fas fa-file-code me-2 text-primary"></i>';
            } else if (file.name.toLowerCase().endsWith('.pdf')) {
                fileIcon = '<i class="fas fa-file-pdf me-2 text-danger"></i>';
            } else if (file.name.toLowerCase().endsWith('.xml')) {
                fileIcon = '<i class="fas fa-file-code me-2 text-warning"></i>';
            } else {
                fileIcon = '<i class="fas fa-file me-2 text-secondary"></i>';
            }
            
            const filePath = file.webkitRelativePath || file.name;
            
            fileCard.innerHTML = `
                <div class="file-info">
                    <div>${fileIcon}${filePath}</div>
                    <div class="small text-muted">${formatFileSize(file.size)}</div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm btn-outline-primary edit-file-btn" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-file-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            fileList.appendChild(fileCard);
        });
        
        // Agregar event listeners para botones de edición y eliminación
        document.querySelectorAll('.edit-file-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const file = jsonFiles[index];
                editFile(file.webkitRelativePath || file.name);
            });
        });
        
        document.querySelectorAll('.remove-file-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                jsonFiles.splice(index, 1);
                renderFileList();
                renderFolderStructure();
                
                // Animación de eliminación
                this.closest('.file-card').style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    renderFileList();
                    renderFolderStructure();
                }, 300);
            });
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Función para transformar archivos JSON con procesamiento optimizado
    async function transformJsonFiles() {
        if (jsonFiles.length === 0) {
            alert("Por favor selecciona al menos un archivo.");
            return;
        }

        processStartTime = Date.now();
        processingSection.style.display = 'block';
        transformResults.style.display = 'none';
        updateProgress(5);
        
        // Resetear contadores
        totalTransformations = 0;
        totalErrors = 0;
        transformedFiles = [];
        transformationsList.innerHTML = '';
        fileSelector.innerHTML = '<option value="">Seleccione un archivo para previsualizar</option>';
        errorDetailsSection.innerHTML = '';
        
        // Preparar la cola de procesamiento
        processingQueue = [...jsonFiles];
        isProcessing = true;
        
        // Agregar animación de procesamiento
        progressFill.classList.add('processing-pulse');
        
        // Procesar archivos uno por uno
        await processQueue();
        
        // Cuando todos los archivos estén procesados
        updateProgress(100);
        showTransformResults();
        
        // Quitar animación de procesamiento
        progressFill.classList.remove('processing-pulse');
        
        // Actualizar dashboard
        updateDashboardStats();
        addToHistory();
    }

    async function processQueue() {
        while (processingQueue.length > 0 && isProcessing) {
            const file = processingQueue.shift();
            const progress = 5 + Math.floor(((jsonFiles.length - processingQueue.length) / jsonFiles.length) * 90);
            updateProgress(progress);
            
            // Mostrar el archivo actual
            currentFileName.textContent = file.name;
            
            try {
                // Solo procesar JSON, mantener otros archivos como están
                if (file.name.toLowerCase().endsWith('.json')) {
                    const transformed = await processFile(file);
                    transformedFiles.push(transformed);
                    
                    // Actualizar contadores
                    totalTransformations += transformed.transformations.length;
                    totalErrors += transformed.errors.length;
                    transformCount.textContent = totalTransformations;
                    errorCount.textContent = totalErrors;
                    
                    // Agregar al selector de vista previa
                    const option = document.createElement('option');
                    option.value = transformedFiles.length - 1;
                    option.textContent = file.webkitRelativePath || file.name;
                    fileSelector.appendChild(option);
                } else {
                    // Para archivos no JSON (PDF, XML), guardar el archivo completo
                    transformedFiles.push({
                        name: file.name,
                        path: file.webkitRelativePath || file.name,
                        original: file, // Guardamos el archivo File completo
                        transformed: null,
                        transformations: [],
                        errors: []
                    });
                }
                
                // Esperar un ciclo de evento para evitar bloquear la UI
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error('Error procesando archivo:', file.name, error);
                showError(`Error procesando ${file.name}: ${error.message}`);
            }
        }
    }

    function processFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const originalData = JSON.parse(e.target.result);
                    const transformedData = JSON.parse(JSON.stringify(originalData)); // Copia profunda
                    const transformations = [];
                    const errors = [];
                    
                    // Aplicar transformaciones
                    applyTransformations(transformedData, transformations, errors, file.name);
                    
                    resolve({
                        name: file.name,
                        path: file.webkitRelativePath || file.name,
                        original: originalData,
                        transformed: transformedData,
                        transformations: transformations,
                        errors: errors
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Error al leer el archivo'));
            };
            
            reader.readAsText(file);
        });
    }

    function applyTransformations(data, transformations, errors, fileName) {
    // Mapa de reemplazos mejorado
    const nomTecnologiaSaludMap = {
            "DEXAMETASONA FOSFATO 4 MGML": "DEXAMETASONA FOSFATO 4MG",
            "METOCLOPRAMIDA10 MG2 ML SLN IN": "METOCLOPRAMIDA 10MG 2ML",
            "SODIO CLORURO 0.9 solucin inye": "SODIO CLORURO 0.9 SOLUCION",
            "DICLOFENACO SDICO 75 MG3 ML SO": "DICLOFENACO SDICO 75MG 3ML",
            "MEROPENEM 1 G POLVO PARA INYEC": "MEROPENEM 1G POLVO",
            "HIOSCINA NBUTIL BROMURO20 MGML": "HIOSCINA NBUTILBROMURO 20MG",
            "DEXAMETASONA (ACETATO) 8 MGML ": "DEXAMETASONA ACETATO 8MG",
            "ACETAMINOFEN 500 MG TABLETAS (": "ACETAMINOFEN 500MG TABLETAS",
            "CEFALOTINA 1G POLVO PARA RECON": "CEFALOTINA 1G POLVO",
            "DIPIRONA 1 G 40 50 SOLUCIN INY": "DIPIRONA 1G 40 50 SOLUCION",
            "DERECHOS DE SALA DE CIRUGIA (QUIROFANOS) COMPLEJIDAD MEDIANA": "DERECHOS DE SALA DE CIRUGIA QUIROFANOS COMPLEJIDAD MEDIANA",
            "DIPIRONA 2.5 G 40 50 SOLUCIN I": "DIPIRONA 2.5 G 40 50 SOLUCION",
            "CEFALEXINA TAB O CAP 500 MG (G": "CEFALEXINA TAB O CAP 500MG",
            "OMEPRAZOL CAP 20 MG (NOVAMED)": "OMEPRAZOL CAP 20MG",
            "TRAMADOL CLORHIDRATO 50 MGML S": "TRAMADOL CLORHIDRATO 50MG",
            "GENTAMICINA 80 MG2 ML INYTBLE ": "GENTAMICINA 80MG 2ML INYTBLE",
            "HIDROCORTISONA (ACETATO) CREMA": "HIDROCORTISONA ACETATO CREMA",
            "ACICLOVIR TAB 200 MG (GENFAR": "ACICLOVIR TAB 200MG",
            "CLORFENIRAMINA JBE 2 MG5 ML (E": "CLORFENIRAMINA JBE 2MG 5ML",
            "MISOPROSTOL TAB 200 MG TECNOQU": "MISOPROSTOL TAB 200MG",
            "MAGNESIO SULFATO 20 SOLUCION I": "MAGNESIO SULFATO 20 SOLUCION",
            "OMEPRAZOL AMP 40 MG POLVO ESTE": "OMEPRAZOL AMP 40MG POLVO",
            "FUROSEMIDA 20 MG2 ML SLN INYEC": "FUROSEMIDA 20MG 2ML",
            "ONDANSETRON 8 MG 4 ML OTROS FA": "ONDANSETRON 8MG 4ML",
            "CEFUROXIMA 750 MG POLVO PARA I": "CEFUROXIMA 750MG POLVO",
            "CEFTRIAXONA 1 G POLVO PARA INY": "CEFTRIAXONA 1G POLVO",
            "GENTAMICINA 80 MG2 ML SOLUCION": "GENTAMICINA 80MG 2ML",
            "AMOXICILINA + ACIDO CLAVULANIC": "AMOXICILINA + ACIDO CLAVULANICO",
            "CEFTAZIDIMA 1 G POLVO PARA INY": "CEFTAZIDIMA 1G POLVO",
            "VANCOMICINA 1 G POLVO PARA INY": "VANCOMICINA 1G POLVO",
            "CIPROFLOXACINA 200 MG100 ML SO": "CIPROFLOXACINA 200MG 100ML",
            "CLARITROMICINA 500 MG ( IV) PO": "CLARITROMICINA 500MG",
            "ACETAMINOFEN 150 MG5 ML (3) JA": "ACETAMINOFEN 150MG 5ML JA",
            "FITOMENADIONA (VITAMINA K1) 10": "FITOMENADIONA VITAMINA K1",
            "GENTAMICINA (SULFATO) 0,3 UNGE": "GENTAMICINA SULFATO 0,3 UNGE",
            "HIDROCORTISONA (SUCCINATO SDIC": "HIDROCORTISONA SUCCINATO",
            "SALBUTAMOL (SULFATO) 100 MCGIN": "SALBUTAMOL SULFATO 100MCG",
            "BECLOMETASONA DIPROPIONATO 50 ": "BECLOMETASONA DIPROPIONATO",
            "IPRATROPIO BROMURO(CIPLATROPIU": "IPRATROPIO BROMURO",
            "BECLOMETASONA DIPROPIONATO SOL": "BECLOMETASONA DIPROPIONATO",
            "RINGER LACTATO (SOLUCIN HARTMA": "RINGER LACTATO SOLUCIN HARTMA",
            "ACIDO TRANEXAMICO 500 MG5 ML A": "ACIDO TRANEXAMICO 500MG 5ML",
            "TRAMADOL CLORHIDRATO 100 MG2ML": "TRAMADOL CLORHIDRATO 100MG 2ML",
            "OMEPRAZOL CAP 20 MG LAFRANCOL": "OMEPRAZOL CAP 20MG",
            "CLOPIDOGREL 75 MG TABLETAS MSN": "CLOPIDOGREL 75MG TABLETAS",
            "MEDROXIPROGESTERONA ACETATO 15": "MEDROXIPROGESTERONA ACETATO",
            "AMIKACINA SULFATO SOLUCIN INYT": "AMIKACINA SULFATO SOLUCION",
            "BACILLUS CLAUSII 5 ML (ENTEROG": "BACILLUS CLAUSII 5ML",
            "AMPICILINA (SODICA) POLVO PARA": "AMPICILINA SODICA POLVO",
            "SULFATO DE ZIN 120 ML JARABE (": "SULFATO DE ZIN 120ML JARABE",
            "CEFTRIAXONA 1G POLVO PARA RECO": "CEFTRIAXONA 1G POLVO",
            "OXITOCINA SOLUCIN INYTBLE 10 U": "OXITOCINA SOLUCION INYECTA",
            "DERECHOS DE SALA DE CIRUGIA (QUIROFANOS) COMPLEJIDAD MEDIANA": "DERECHOS DE SALA DE CIRUGIA QUIROFANOS COMPLEJIDAD MEDIANA",
            "ALUMINIO HIDROXIDO MAGNESIO HI": "ALUMINIO HIDROXIDO MAGNESIO",
            "BROMURO DE IPRATROPIO 20 mcg B": "BROMURO DE IPRATROPIO 20MCG",
            "CAPTOPRIL 25 MG TABLETAS (BUSI": "CAPTOPRIL 25MG TABLETAS",
            "CAPTOPRIL 50 MG TABLETAS (BUSI": "CAPTOPRIL 50MG TABLETAS",
            "SULFATO DE ZIN 120 ML JARABE T": "SULFATO DE ZIN 120ML JARABE",
            "FTLC SOBRE DE NUTRIENTES PARA ": "FTLC SOBRE DE NUTRIENTES",
            "F75 POTE DISEADO PARA LA FASE ": "F75 POTE DISENADO PARA LA FASE",
            "NIFEDIPINA 30 MG TAB O CAP (NO": "NIFEDIPINA 30MG TAB O CAP",
            "POTASIO CLORURO 2 MEQ 10 ML SO": "POTASIO CLORURO 2 MEQ 10ML",
            "SALES DE REHIDRATACION ORAL, F": "SALES DE REHIDRATACION ORAL",
            "AMPICILINA SODICA SULBACTAM SD": "AMPICILINA SODICA",
            "TRIMETOPRIM SULFAMETOXAZOL SUS": "TRIMETOPRIM SULFAMETOXAZOL",
            "SODIO FOSFATO 133ML (ENEMA) BC": "SODIO FOSFATO 133ML",
            "DEXAMETASONA (FOSFATO) 4 MGML ": "DEXAMETASONA FOSFATO 4MG",
            "ADRENALINA 1 MG1ML AMPOYA (BIO": "ADRENALINA 1MG 1ML AMPOLLA",
            "ACETIL SALICILICO ACIDO 100 MG": "ACETIL SALICILICO ACIDO 100MG",
            "GENTAMICINA 160 MG2 ML INYECTA": "GENTAMICINA 160MG 2ML INYECTA",
            "ATORVASTATINA 40 MG TABLETAS(G": "ATORVASTATINA 40MG TABLETAS",
            "CLARITROMICINA 500 MG (KLARICI": "CLARITROMICINA 500MG",
            "CLINDAMICINA 600 MG SOLUCION I": "CLINDAMICINA 600MG SOLUCION",
            "DIMENHIDRINATO 50 MG TABLETAS ": "DIMENHIDRINATO 50MG TABLETAS",
            "METILPREDNISOLONA (SUCCINATO S": "METILPREDNISOLONA SUCCINATO",
            "DEXAMETASONA (FOSFATO) 4 MGML ": "DEXAMETASONA FOSFATO 4MG",
            "TIAMINA TAB O CAP 300 MG (ECAR": "TIAMINA TAB O CAP 300MG",
            "INSULINA ZINC N.P.H.80 100 UI ": "INSULINA ZINC N.P.H.80 100 UI",
            "FENITOINA SODICA 250 MG5 ML IN": "FENITOINA SODICA 250MG 5ML",
            "ACIDO FUSIDICO CREMA 2 GENFAR": "ACIDO FUSIDICO CREMA",
            "CLARITROMICINA 500 MG POLVO PA": "CLARITROMICINA 500 MG POLVO PA",
            "FEXOFENADINA 30mg5 ml solucion": "FEXOFENADINA 30MG 5ML SOLUCION",
            "LEVOTIROXINA SODICA 25 MCG TAB": "LEVOTIROXINA SODICA 25MCG TAB",
            "CLORFENIRAMINA MALEATO TAB 4 M": "CLORFENIRAMINA MALEATO TAB 4M",
            "AMLODIPINO 5 MG TABLETAS ( GEN": "AMLODIPINO 5MG TABLETAS",
            "FITOMENADIONA (VITAMINA K) 1 M": "FITOMENADIONA VITAMINA K1",
            "KETOTIFENO 1 MG5 ML (0,02) JAR": "KETOTIFENO 1MG 5ML 0,02 JAR",
            "SODIO CLORURO 20 mEq 10 mL SOL": "SODIO CLORURO 20MEQ 10ML SOL",
            "FENOTEROL BROMHIDRATO BROMURO ": "FENOTEROL BROMHIDRATO BROMURO",
            "CARVEDILOL 6,25MG TAB GENFAR": "CARVEDILOL 6,25MG TAB",
            "METRONIDAZOL 500 MG VULO O TAB": "METRONIDAZOL 500MG OVULO O TAB",
            "OXACILINA (SAL SODICA) POLVO P": "OXACILINA SAL SODICA POLVO",
            "LORATADINA 5 MG5 ML (0,1) JARA": "LORATADINA 5MG 5ML 0,1 JARA",
            "METRONIDAZOL 500 MG TABLETAS (": "METRONIDAZOL 500 MG TABLETAS",
            "METOCLOPRAMIDA (CLORHIDRATO) 4": "METOCLOPRAMIDA CLORHIDRATO 4",
            "TOXOIDE TETANICO SOLUCIN INYTB": "TOXOIDE TETANICO SOLUCION INY",
            "ATORVASTATINA 20 MG TABLETAS (": "ATORVASTATINA 20MG TABLETAS",
            "ONDANSETRON 8 MG 4 ML": "ONDANSETRON 8MG 4ML",
            "SODIO FOSFATO 133ML (ENEMA) TE": "SODIO FOSFATO 133ML",
            "ATORVASTATINA 40 MG TABLETAS(E": "ATORVASTATINA 40MG TABLETAS",
            "BISACODILO 5 MG TABLETAS ( HUM": "BISACODILO 5MG TABLETAS",
            "HALOPERIDOL SOLUCIN INYTBLE 5 ": "HALOPERIDOL SOLUCION INYTABLE",
            "DIAZEPAM SOLUCIN INYTBLE 10 MG": "DIAZEPAM SOLUCIN INYTBLE 10MG",
            "CIPROFLOXACINA (CLORHIDRATO) T":  "CIPROFLOXACINA CLORHIDRATO",
            "METRONIDAZOL 250 MG5 ML SUSP O": "METRONIDAZOL 250MG 5ML SUSP",
            "SULFATO DE ZIN 120 ML JARABE": "SULFATO DE ZIN 120ML JARABE",
            "DEXTROSA AL 5 AGUA DESTILADA 5": "DEXTROSA 5% AGUA DESTI 500ML",
            "BACILLUS CLAUSII 2 MILLARDOS 5": "BACILLUS CLAUSII 2 MILLARDOS",
            "CLOTRIMAZOL 1 CREMA TOPICA ( C": "CLOTRIMAZOL 1 CREMA TOPICA",
            "BETAMETAZONA FOSFATO SODICO 8 ": "BETAMETAZONA FOSFATO SODICO",
            "METFORMINA 850 MG TABLETAS (WI": "METFORMINA 850MG TABLETAS",
            "LOSARTAN TAB 50 MG (GENFAR)": "LOSARTAN TAB 50MG",
            "BISACODILO 5 MG TABLETAS BUSIE": "BISACODILO 5MG TABLETAS",
            "CIPROFLOXACINA 100 MG10 ML SOL": "CIPROFLOXACINA 100MG 10ML",
            "NITROFURANTOINA TAB O CAP 100 ": "NITROFURANTOINA TAB O CAP 100",
            "HIERRO (FERROSO) SULFATO ANHID": "HIERRO FERROSO SULFATO",
            "ACIDO FOLICO 1 MG TABLETAS (EC": "ACIDO FOLICO 1MG TABLETAS",
            "LOSARTAN 100 MG TABLETAS GENFA": "LOSARTAN 100MG TABLETAS",
            "AMLODIPINO 10 MG TAB GENFAR": "AMLODIPINO 10MG TAB",
            "ALBENDAZOL 200 MG TABLETAS (LA": "ALBENDAZOL 200MG TABLETAS",
            "IBUPROFENO TAB 400 MG (GENFAR)": "IBUPROFENO TAB 400MG",
            "METOPROLOL 50 MG TAB () GENFAR": "METOPROLOL 50MG TAB",
            "CAPTOPRIL 50 MG TABLETAS (LABI": "CAPTOPRIL 50MG TABLETAS",
            "NO APLICA": "" // Transforma "NO APLICA" a vacío
        };

        // Función para validar el tipo de usuario según el régimen
        function validarTipoUsuario(usuario, path) {
            if (usuario.tipoUsuario) {
                // Validar régimen subsidiado (debe ser tipoUsuario "04")
                if (usuario.regimen === "SUBSIDIADO" || usuario.regimen === "1") {
                    if (usuario.tipoUsuario !== "04") {
                        errors.push({
                            type: 'error',
                            field: 'tipoUsuario',
                            message: `Usuario en régimen subsidiado debe tener tipoUsuario "04" pero tiene "${usuario.tipoUsuario}" en archivo ${fileName}`,
                            path: path,
                            fileName: fileName
                        });
                    }
                }
                // Validar régimen contributivo (debe ser tipoUsuario "01" o "02")
                else if (usuario.regimen === "CONTRIBUTIVO" || usuario.regimen === "2") {
                    if (usuario.tipoUsuario !== "01" && usuario.tipoUsuario !== "02") {
                        errors.push({
                            type: 'error',
                            field: 'tipoUsuario',
                            message: `Usuario en régimen contributivo debe tener tipoUsuario "01" o "02" pero tiene "${usuario.tipoUsuario}" en archivo ${fileName}`,
                            path: path,
                            fileName: fileName
                        });
                    }
                }
            }
        }

        // Función recursiva para recorrer todo el objeto JSON
        function traverseAndTransform(obj, path = '') {
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    traverseAndTransform(item, `${path}[${index}]`);
                });
            } else if (obj && typeof obj === 'object') {
                // Validar tipo de usuario si encontramos un objeto con campo 'regimen'
                if (obj.regimen && obj.tipoUsuario) {
                    validarTipoUsuario(obj, path);
                }

                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const newPath = path ? `${path}.${key}` : key;
                        const value = obj[key];
                        
                        // 1. Validación para codDiagnosticoPrincipal vacío
                        if (key === 'codDiagnosticoPrincipal' && (value === "" || value === null)) {
                            errors.push({
                                type: 'error',
                                field: key,
                                message: `Campo ${key} vacío en archivo ${fileName}, ruta: ${newPath}`,
                                path: newPath,
                                fileName
                            });
                        }
                        // 2. Validación para codServicio null (NUEVA VALIDACIÓN)
                        if (key === 'codServicio' && value === null) {
                            errors.push({
                                type: 'error',
                                field: key,
                                message: `Campo ${key} es null en archivo ${fileName}, ruta: ${newPath}`,
                                path: newPath,
                                 fileName
                           });
                        }
 // 3. Transformaciones para nomTecnologiaSalud
                    else if (key === 'nomTecnologiaSalud' && typeof value === 'string') {
                        // Validar si el campo está vacío o es "NO APLICA"
                        if (value === "" || value === "NO APLICA") {
                            errors.push({
                                type: 'error',
                                field: key,
                                message: `Campo ${key} vacío o con valor "NO APLICA" en archivo ${fileName}, ruta: ${newPath}`,
                                path: newPath,
                                fileName
                            });
                        }
                        
                        // Normalizar valores según el mapa
                        if (nomTecnologiaSaludMap[value]) {
                            const newValue = nomTecnologiaSaludMap[value];
                            obj[key] = newValue;
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: value,
                                after: newValue,
                                path: newPath,
                                description: `Normalizado ${key}: "${value}" → "${newValue}"`
                            });
                        }
                    }
                    // 4. Transformaciones para codTecnologiaSalud (SOLO UN BLOQUE)
                    else if (key === 'codTecnologiaSalud' && typeof value === 'string') {
                        let newValue = value;
                        let changed = false;

                        // Eliminar el carácter \u001f (Unit Separator) si existe
                        if (newValue.includes('\u001f')) {
                            const oldValue = newValue;
                            newValue = newValue.replace(/\u001f/g, '');
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: oldValue,
                                after: newValue,
                                path: newPath,
                                description: `Limpieza de carácter especial en ${key}: "${oldValue}" → "${newValue}"`
                            });
                            changed = true;
                        }

                        // Eliminar espacios en blanco al inicio y final
                        const trimmedValue = newValue.trim();
                        if (trimmedValue !== newValue) {
                            const oldValue = newValue;
                            newValue = trimmedValue;
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: oldValue,
                                after: newValue,
                                path: newPath,
                                description: `Limpieza de espacios en ${key}: "${oldValue}" → "${newValue}"`
                            });
                            changed = true;
                        }

                        // Transformación específica para el valor "2DS00"
                        if (newValue === "2DS00") {
                            const oldValue = newValue;
                            newValue = "2DS002";
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: oldValue,
                                after: newValue,
                                path: newPath,
                                description: `Transformación específica en ${key}: "${oldValue}" → "${newValue}"`
                            });
                            changed = true;
                        }

                        // Actualizar el valor en el objeto solo si hubo cambios
                        if (changed) {
                            obj[key] = newValue;
                        }

                        // Validar si está vacío después de la limpieza
                        if (obj[key] === "") {
                            errors.push({
                                type: 'error',
                                field: key,
                                message: `Campo ${key} vacío después de limpieza en archivo ${fileName}, ruta: ${newPath}`,
                                path: newPath,
                                fileName
                            });
                        }
                    }
                    // 5. Transformaciones para numAutorizacion
                    else if (key === 'numAutorizacion' && typeof value === 'string') {
                        // Eliminar comillas dobles innecesarias y espacios
                        const newValue = value.replace(/^"|"$|\s/g, '');
                        
                        if (newValue !== value) {
                            obj[key] = newValue;
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: value,
                                after: newValue,
                                path: newPath,
                                description: `Limpieza de espacios en ${key}: "${value}" → "${newValue}"`
                            });
                        }
                        
                        // Validar si está vacío
                        if (newValue === "" || newValue === "null") {
                            errors.push({
                                type: 'error',
                                field: key,
                                message: `Campo ${key} vacío en archivo ${fileName}, ruta: ${newPath}`,
                                path: newPath,
                                fileName
                            });
                        }
                    }
                    // 6. Transformaciones para causaMotivoAtencion
                    else if (key === 'causaMotivoAtencion' && typeof value === 'string') {
                        // Cambiar valor de 13 o 21 a 38
                        if (value === "13" || value === "21") {
                            obj[key] = "38";
                            transformations.push({
                                type: 'field',
                                field: key,
                                before: value,
                                after: "38",
                                path: newPath,
                                description: `Actualizado ${key}: "${value}" → "38"`
                            });
                        }
                    }
                    // 7. Validaciones para campos vacíos
                    else if (key === 'tipoDocumentoIdentificacion' && (value === null || value === "")) {
                        errors.push({
                            type: 'error',
                            field: key,
                            message: `Campo ${key} vacío en archivo ${fileName}, ruta: ${newPath}`,
                            path: newPath,
                            fileName
                        });
                    }
                    else if (key === 'numDocumentoIdentificacion' && (value === null || value === "")) {
                        errors.push({
                            type: 'error',
                            field: key,
                            message: `Campo ${key} vacío en archivo ${fileName}, ruta: ${newPath}`,
                            path: newPath,
                            fileName
                        });
                    }
                    // 8. Transformación para documentos PT
                    else if (key === 'tipoDocumentoIdentificacion' && value === "PT") {
                        if (obj['codPaisOrigen'] === "170") {
                            obj['codPaisOrigen'] = "862";
                            transformations.push({
                                type: 'usuario',
                                field: 'codPaisOrigen',
                                before: "170",
                                after: "862",
                                path: newPath.replace('tipoDocumentoIdentificacion', 'codPaisOrigen'),
                                description: `Usuario con documento PT: codPaisOrigen cambiado de "170" a "862"`
                            });
                        }
                    }
                    // 9. Transformaciones para servicios
                    else if (key === 'servicios') {
                        // Buscar hospitalización para obtener fechaInicioAtencion con hora
                        let fechaHoraHospitalizacion = null;
                        
                        if (obj[key].hospitalizacion) {
                            obj[key].hospitalizacion.forEach((hosp, hospIndex) => {
                                if (hosp.fechaInicioAtencion && validarFechaHora(hosp.fechaInicioAtencion)) {
                                    fechaHoraHospitalizacion = hosp.fechaInicioAtencion;
                                    transformations.push({
                                        type: 'hospitalizacion',
                                        field: 'fechaInicioAtencion',
                                        path: `${newPath}.hospitalizacion[${hospIndex}]`,
                                        description: `Fecha y hora de hospitalización encontrada: ${fechaHoraHospitalizacion}`
                                    });
                                } else if (hosp.fechaInicioAtencion) {
                                    errors.push({
                                        type: 'error',
                                        field: 'fechaInicioAtencion',
                                        message: `Formato de fecha-hora inválido en hospitalización: ${hosp.fechaInicioAtencion}`,
                                        path: `${newPath}.hospitalizacion[${hospIndex}]`,
                                        fileName
                                    });
                                }
                            });
                        }

                        // Asignar fecha-hora a urgencias que YA TIENEN FECHA
                        if (fechaHoraHospitalizacion && obj[key].urgencias) {
                            obj[key].urgencias.forEach((urg, urgIndex) => {
                                if (urg.fechaEgreso) {
                                    const oldValue = urg.fechaEgreso;
                                    
                                    // Validar formato existente
                                    if (!validarFechaHora(oldValue)) {
                                        errors.push({
                                            type: 'error',
                                            field: 'fechaEgreso',
                                            message: `Formato de fecha-hora inválido en urgencias: ${oldValue}`,
                                            path: `${newPath}.urgencias[${urgIndex}]`,
                                            fileName
                                        });
                                        return;
                                    }
                                    
                                    urg.fechaEgreso = fechaHoraHospitalizacion;
                                    transformations.push({
                                        type: 'urgencia',
                                        field: 'fechaEgreso',
                                        before: oldValue,
                                        after: fechaHoraHospitalizacion,
                                        path: `${newPath}.urgencias[${urgIndex}]`,
                                        description: `Reemplazada fecha-hora de egreso existente (${oldValue}) por fecha-hora de hospitalización (${fechaHoraHospitalizacion})`
                                    });
                                }
                            });
                        }
                        
                        // Transformaciones para servicios de procedimientos
                        if (obj[key].procedimientos) {
                            obj[key].procedimientos.forEach((proc, procIndex) => {
                                if (proc.finalidadTecnologiaSalud === "44" || proc.finalidadTecnologiaSalud === "16") {
                                    const oldValue = proc.finalidadTecnologiaSalud;
                                    proc.finalidadTecnologiaSalud = "15";
                                    transformations.push({
                                        type: 'procedimiento',
                                        field: 'finalidadTecnologiaSalud',
                                        before: oldValue,
                                        after: "15",
                                        path: `${newPath}.procedimientos[${procIndex}]`,
                                        description: `Procedimiento: finalidadTecnologiaSalud cambiado de "${oldValue}" a "15"`
                                    });
                                }
                                
                                if (proc.viaIngresoServicioSalud === "02") {
                                    proc.viaIngresoServicioSalud = "03";
                                    transformations.push({
                                        type: 'procedimiento',
                                        field: 'viaIngresoServicioSalud',
                                        before: "02",
                                        after: "03",
                                        path: `${newPath}.procedimientos[${procIndex}]`,
                                        description: `Procedimiento: viaIngresoServicioSalud cambiado de "02" a "03"`
                                    });
                                }
                            });
                        }
                        
                        // Transformaciones para servicios de consultas
                        if (obj[key].consultas) {
                            obj[key].consultas.forEach((consulta, consultaIndex) => {
                                if (consulta.finalidadTecnologiaSalud === "44" || consulta.finalidadTecnologiaSalud === "10") {
                                    const oldValue = consulta.finalidadTecnologiaSalud;
                                    consulta.finalidadTecnologiaSalud = "15";
                                    transformations.push({
                                        type: 'consulta',
                                        field: 'finalidadTecnologiaSalud',
                                        before: oldValue,
                                        after: "15",
                                        path: `${newPath}.consultas[${consultaIndex}]`,
                                        description: `Consulta: finalidadTecnologiaSalud cambiado de "${oldValue}" a "15"`
                                   });
                                }
                            });
                        }
                    }
                    
                    // Continuar recorriendo el objeto
                    traverseAndTransform(obj[key], newPath);
                }
            }
        }
    }
    
    // Función para validar formato de fecha y hora
    function validarFechaHora(fechaHora) {
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fechaHora);
    }
    
    // Iniciar el recorrido recursivo
    traverseAndTransform(data);
}

    function updateJsonPreview() {
        const index = fileSelector.value;
        if (index === "" || !transformedFiles[index]) {
            jsonPreview.textContent = "Seleccione un archivo para ver la vista previa";
            return;
        }
        
        const file = transformedFiles[index];
        
        // Solo mostrar vista previa para archivos JSON
        if (file.name.toLowerCase().endsWith('.json')) {
            jsonPreview.textContent = JSON.stringify(file.transformed, null, 2);
        } else {
            jsonPreview.textContent = `Vista previa no disponible para ${file.name}. El archivo se mantendrá sin cambios.`;
        }
    }

    function showTransformResults() {
        processingSection.style.display = 'none';
        transformResults.style.display = 'block';
        
        // Mostrar resumen de transformaciones
        let totalTransforms = 0;
        let totalErrors = 0;
        
        transformedFiles.forEach((file, index) => {
            if (file.transformations.length > 0 || file.errors.length > 0 || !file.name.toLowerCase().endsWith('.json')) {
                const fileTransform = document.createElement('div');
                fileTransform.className = 'transform-item';
                
                if (file.name.toLowerCase().endsWith('.json')) {
                    fileTransform.innerHTML = `
                        <h6><i class="fas fa-file-code me-2"></i>${file.path}</h6>
                        <div class="small">Transformaciones aplicadas: ${file.transformations.length}</div>
                        <div class="small ${file.errors.length ? 'text-danger' : ''}">Errores encontrados: ${file.errors.length}</div>
                    `;
                    
                    // Mostrar hasta 3 transformaciones por archivo
                    file.transformations.slice(0, 3).forEach(transform => {
                        fileTransform.innerHTML += `
                            <div class="small mt-2">
                                <i class="fas fa-arrow-right me-2 text-success"></i>
                                ${transform.description}
                            </div>
                        `;
                    });
                    
                    // Si hay más transformaciones, mostrar mensaje
                    if (file.transformations.length > 3) {
                        fileTransform.innerHTML += `
                            <div class="small mt-2 text-muted">
                                + ${file.transformations.length - 3} transformaciones más...
                            </div>
                        `;
                    }
                    
                    // Mostrar hasta 3 errores por archivo
                    file.errors.slice(0, 3).forEach(error => {
                        fileTransform.innerHTML += `
                            <div class="small mt-2 text-danger">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                ${error.message}
                            </div>
                        `;
                    });
                    
                    // Si hay más errores, mostrar mensaje
                    if (file.errors.length > 3) {
                        fileTransform.innerHTML += `
                            <div class="small mt-2 text-danger">
                                + ${file.errors.length - 3} errores más...
                            </div>
                        `;
                    }
                } else {
                    fileTransform.innerHTML = `
                        <h6><i class="${file.name.toLowerCase().endsWith('.pdf') ? 'fas fa-file-pdf' : 'fas fa-file-code'} me-2"></i>${file.path}</h6>
                        <div class="small text-muted">Archivo no JSON - se mantendrá sin cambios</div>
                    `;
                }
                
                transformationsList.appendChild(fileTransform);
                totalTransforms += file.transformations.length;
                totalErrors += file.errors.length;
            }
        });
        
        // Si no hubo transformaciones ni errores
        if (totalTransforms === 0 && totalErrors === 0) {
            transformationsList.innerHTML = `
                <div class="alert alert-info">
                    No se aplicaron transformaciones ni se encontraron errores en los archivos. Todos los datos cumplen con las reglas requeridas.
                </div>
            `;
        }
        
        // Mostrar detalles de errores
        showErrorDetails();
        
        // Mostrar resultados de validación
        showValidationResults(totalTransforms, totalErrors);
    }

    function showErrorDetails() {
        let hasErrors = false;
        errorDetailsSection.innerHTML = '';
        
        transformedFiles.forEach(file => {
            if (file.errors.length > 0 && file.name.toLowerCase().endsWith('.json')) {
                hasErrors = true;
                const errorCard = document.createElement('div');
                errorCard.className = 'card mb-4';
                errorCard.innerHTML = `
                    <div class="card-header bg-danger text-white">
                        <h5 class="mb-0"><i class="fas fa-exclamation-triangle me-2"></i>Errores en ${file.path}</h5>
                    </div>
                    <div class="card-body">
                        ${file.errors.map(error => `
                            <div class="error-item">
                                <strong>${error.field}</strong>: ${error.message}
                            </div>
                        `).join('')}
                    </div>
                `;
                errorDetailsSection.appendChild(errorCard);
            }
        });
        
        if (!hasErrors) {
            errorDetailsSection.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    No se encontraron errores en los archivos procesados
                </div>
            `;
        }
    }

    function showValidationResults(totalTransforms, totalErrors) {
        validationResults.innerHTML = `
            <div class="validation-item ${jsonFiles.length > 0 ? 'valid-item' : 'invalid-item'}">
                <i class="fas ${jsonFiles.length > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <div>Archivos procesados: ${jsonFiles.length}</div>
            </div>
            <div class="validation-item ${totalTransforms > 0 ? 'valid-item' : 'invalid-item'}">
                <i class="fas ${totalTransforms > 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <div>Transformaciones aplicadas: ${totalTransforms}</div>
            </div>
            <div class="validation-item ${totalErrors === 0 ? 'valid-item' : 'invalid-item'}">
                <i class="fas ${totalErrors === 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <div>Errores encontrados: ${totalErrors}</div>
            </div>
        `;
    }

    function downloadTransformedFiles(type) {
        if (transformedFiles.length === 0) {
            alert('Primero debe transformar los archivos');
            return;
        }

        const zip = new JSZip();
        let filesToDownload = [];
        
        if (type === 'all') {
            filesToDownload = transformedFiles;
        } else if (type === 'selected') {
            const index = fileSelector.value;
            if (index === "") {
                alert('Por favor seleccione un archivo para descargar');
                return;
            }
            filesToDownload = [transformedFiles[index]];
        }
        
        // Contador para saber cuántos archivos binarios quedan por leer
        let pendingBinaryFiles = 0;
        
        filesToDownload.forEach(file => {
            const path = file.path || (file.webkitRelativePath || file.name);
            const folderPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
            
            if (file.name.toLowerCase().endsWith('.json')) {
                // Para archivos JSON, usar el contenido transformado
                const jsonStr = JSON.stringify(file.transformed, null, 2);
                
                if (folderPath) {
                    zip.folder(folderPath).file(file.name, jsonStr);
                } else {
                    zip.file(file.name, jsonStr);
                }
            } else {
                // Para archivos no JSON (PDF, XML), leer el contenido original
                pendingBinaryFiles++;
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    if (folderPath) {
                        zip.folder(folderPath).file(file.name, e.target.result);
                    } else {
                        zip.file(file.name, e.target.result);
                    }
                    
                    pendingBinaryFiles--;
                    
                    // Cuando todos los archivos binarios se han leído, generar el ZIP
                    if (pendingBinaryFiles === 0) {
                        generateZip();
                    }
                };
                
                reader.readAsArrayBuffer(file.original);
            }
        });
        
        // Si no hay archivos binarios, generar el ZIP inmediatamente
        if (pendingBinaryFiles === 0) {
            generateZip();
        }
        
        function generateZip() {
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                const fileName = type === 'all' ? 'archivos_transformados.zip' : 'archivo_transformado.zip';
                saveAs(content, fileName);
                
                // Animación de confirmación
                const btn = type === 'all' ? downloadAllBtn : downloadSelectedBtn;
                btn.innerHTML = '<i class="fas fa-check me-1"></i>Descargado!';
                btn.classList.add('btn-success');
                setTimeout(() => {
                    btn.innerHTML = type === 'all' ? 
                        '<i class="fas fa-download me-1"></i>Descargar Todos' : 
                        '<i class="fas fa-file-download me-1"></i>Descargar Selección';
                    btn.classList.remove('btn-success');
                }, 2000);
            })
            .catch(error => {
                console.error('Error generando ZIP:', error);
                alert('Error al generar el archivo ZIP: ' + error.message);
            });
        }
    }

    function updateProgress(percent) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        progressFill.setAttribute('aria-valuenow', percent);
    }

    function resetProcess() {
        jsonFiles = [];
        folderTree = {};
        transformedFiles = [];
        totalTransformations = 0;
        totalErrors = 0;
        transformCount.textContent = '0';
        fileCount.textContent = '0';
        errorCount.textContent = '0';
        isProcessing = false;
        processingQueue = [];
        
        jsonFileInput.value = '';
        folderStructure.innerHTML = '';
        jsonDropZone.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Arrastra y suelta tus archivos JSON, PDF o XML aquí</p>
            <p class="small text-muted">o haz clic para seleccionar</p>
        `;
        
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        fileList.innerHTML = '';
        validationResults.innerHTML = '';
        transformationsList.innerHTML = '';
        fileSelector.innerHTML = '<option value="">Seleccione un archivo para previsualizar</option>';
        errorDetailsSection.innerHTML = '';
        processingSection.style.display = 'none';
        transformResults.style.display = 'none';
        fileEditor.classList.add('hidden');
        currentlyEditingFile = null;
        
        // Actualizar dashboard
        updateDashboardStats();
    }

    function showError(message) {
        validationResults.innerHTML = `
            <div class="validation-item invalid-item" role="alert">
                <i class="fas fa-times-circle"></i>
                <div>${message}</div>
            </div>
        `;
    }
    
    function updateDashboardStats() {
        // Actualizar estadísticas
        dashboardFileCount.textContent = jsonFiles.length;
        dashboardTransformCount.textContent = totalTransformations;
        dashboardErrorCount.textContent = totalErrors;
        
        // Calcular tiempo promedio
        if (jsonFiles.length > 0 && processStartTime > 0) {
            const duration = (Date.now() - processStartTime) / 1000;
            const avgTime = (duration / jsonFiles.length).toFixed(1);
            dashboardAvgTime.textContent = `${avgTime}s`;
            document.getElementById('avgTime').textContent = `${avgTime}s`;
        }
        
        // Actualizar porcentajes de tipo de archivo
        if (jsonFiles.length > 0) {
            const jsonCount = jsonFiles.filter(f => f.name.toLowerCase().endsWith('.json')).length;
            const pdfCount = jsonFiles.filter(f => f.name.toLowerCase().endsWith('.pdf')).length;
            const xmlCount = jsonFiles.filter(f => f.name.toLowerCase().endsWith('.xml')).length;
            
            document.getElementById('jsonPercent').textContent = `${Math.round((jsonCount / jsonFiles.length) * 100)}%`;
            document.getElementById('pdfPercent').textContent = `${Math.round((pdfCount / jsonFiles.length) * 100)}%`;
            document.getElementById('xmlPercent').textContent = `${Math.round((xmlCount / jsonFiles.length) * 100)}%`;
            
            // Actualizar porcentajes de estado
            const successPercent = Math.round(((jsonFiles.length - totalErrors) / jsonFiles.length) * 100);
            const errorPercent = Math.round((totalErrors / jsonFiles.length) * 100);
            const warningPercent = 100 - successPercent - errorPercent;
            
            document.getElementById('successPercent').textContent = `${successPercent}%`;
            document.getElementById('warningPercent').textContent = `${warningPercent}%`;
            document.getElementById('errorPercent').textContent = `${errorPercent}%`;
        }
        
        // Actualizar archivos recientes
        renderRecentFiles();
    }
    
    function addToHistory() {
        if (jsonFiles.length === 0) return;
        
        const historyItem = {
            files: jsonFiles.length,
            transformations: totalTransformations,
            errors: totalErrors,
            date: new Date()
        };
        
        processHistory.unshift(historyItem);
        renderHistory();
    }
    
    function renderHistory() {
        if (processHistory.length === 0) {
            historyList.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <p>No se han hecho correcciones</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        processHistory.slice(0, 4).forEach(item => {
            const status = item.errors === 0 ? 'Completada' : 'Con errores';
            const statusClass = item.errors === 0 ? 'status-completed' : 'status-error';
            
            const historyItemEl = document.createElement('div');
            historyItemEl.className = 'history-item';
            historyItemEl.innerHTML = `
                <div class="history-icon">
                    <i class="fas ${item.errors === 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div class="history-content">
                    <div class="history-title">Transformación ${status}</div>
                    <div class="history-meta">
                        <span class="history-time">${item.date.toLocaleString()}</span>
                        <span class="history-stats">
                            <span class="history-stat">${item.files} archivos</span>
                            <span class="history-stat">${item.transformations} transformaciones</span>
                            <span class="history-stat">${item.errors} errores</span>
                        </span>
                    </div>
                </div>
            `;
            historyList.appendChild(historyItemEl);
        });
    }
    
    function renderRecentFiles() {
        if (jsonFiles.length === 0) {
            recentFilesList.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                    <p>No hay archivos recientes</p>
                </div>
            `;
            return;
        }
        
        recentFilesList.innerHTML = '';
        
        jsonFiles.slice(0, 4).forEach(file => {
            const fileType = file.name.split('.').pop().toUpperCase();
            const fileIcon = file.name.toLowerCase().endsWith('.json') ? 'fa-file-code' : 
                            file.name.toLowerCase().endsWith('.pdf') ? 'fa-file-pdf' : 
                            file.name.toLowerCase().endsWith('.xml') ? 'fa-file-code' : 'fa-file';
            
            const fileItemEl = document.createElement('div');
            fileItemEl.className = 'recent-file-item';
            fileItemEl.innerHTML = `
                <div class="recent-file-icon">
                    <i class="fas ${fileIcon}"></i>
                </div>
                <div class="recent-file-info">
                    <div class="recent-file-name">${file.webkitRelativePath || file.name}</div>
                    <div class="recent-file-meta">${formatFileSize(file.size)} • ${fileType}</div>
                </div>
                <div class="recent-file-actions">
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            `;
            recentFilesList.appendChild(fileItemEl);
        });
    }

    // ======================================================================
// FUNCIONES PARA VALIDACIÓN DE TIPOS DE USUARIO ENTRE JSON Y XML
// ======================================================================

function validateUserTypesConsistency() {
    if (jsonFiles.length === 0) {
        alert('No hay archivos cargados para validar');
        return;
    }

    // Mapeo de códigos de tipo de usuario a descripciones esperadas
    const expectedUserTypes = {
        '01': { description: 'Cotizante', required: true },
        '02': { description: 'Beneficiario', required: true },
        '03': { description: 'Vinculado', required: true },
        '04': { description: 'Subsidiado', required: true },
        '05': { description: 'Particular', required: false },
        '06': { description: 'Otro', required: false }
    };

    const inconsistencies = [];
    let xmlFiles = [];
    let jsonDataFiles = [];

    // Separar archivos JSON y XML
    jsonFiles.forEach(file => {
        if (file.name.toLowerCase().endsWith('.json')) {
            jsonDataFiles.push(file);
        } else if (file.name.toLowerCase().endsWith('.xml')) {
            xmlFiles.push(file);
        }
    });

    if (jsonDataFiles.length === 0) {
        alert('Se necesitan archivos JSON (RIPS) para validar');
        return;
    }

    // Si no hay XML, solo validar que los códigos en JSON sean válidos
    if (xmlFiles.length === 0) {
        validateJsonUserTypesOnly(jsonDataFiles, expectedUserTypes);
        return;
    }

    // Contador para archivos procesados
    let filesProcessed = 0;
    const totalFiles = jsonDataFiles.length;

    // Mostrar progreso
    const validationProgress = document.createElement('div');
    validationProgress.className = 'alert alert-info';
    validationProgress.innerHTML = `
        <div class="d-flex justify-content-between">
            <span>Validando tipos de usuario...</span>
            <span id="validationProgressText">0/${totalFiles}</span>
        </div>
        <div class="progress mt-2">
            <div id="validationProgressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" style="width: 0%"></div>
        </div>
    `;
    errorDetailsSection.innerHTML = '';
    errorDetailsSection.appendChild(validationProgress);

    // Procesar cada archivo JSON
    jsonDataFiles.forEach(jsonFile => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const jsonFileName = jsonFile.name;
                
                // Buscar todos los tipos de usuario en el JSON
                const jsonUserTypes = findUserTypesInJson(jsonData);
                
                // Para cada tipo de usuario encontrado en el JSON, buscar en XML
                jsonUserTypes.forEach(userType => {
                    const expectedType = expectedUserTypes[userType.code];
                    
                    if (!expectedType) {
                        // Código no reconocido
                        inconsistencies.push({
                            type: 'UNKNOWN_CODE',
                            jsonFile: jsonFileName,
                            jsonPath: userType.path,
                            jsonCode: userType.code,
                            message: `Código de tipo de usuario no reconocido: ${userType.code}`
                        });
                        return;
                    }
                    
                    // Verificar si existe un XML que coincida
                    let foundInXml = false;
                    
                    xmlFiles.forEach(xmlFile => {
                        const xmlReader = new FileReader();
                        
                        xmlReader.onload = function(xmlEvent) {
                            const xmlContent = xmlEvent.target.result;
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
                            
                            // Buscar el schemeID correspondiente en el XML
                            // Mejoramos la búsqueda para considerar diferentes formatos XML
                            const userTypeNodes = xmlDoc.querySelectorAll(`
                                Value[schemeName*="tipo_usuario"][schemeID="${userType.code}"],
                                Value[schemeName*="usuario"][schemeID="${userType.code}"],
                                Value[schemeID="${userType.code}"]
                            `);
                            
                            if (userTypeNodes.length > 0) {
                                foundInXml = true;
                                
                                // Verificar que la descripción coincida
                                userTypeNodes.forEach(node => {
                                    const xmlDescription = node.textContent.trim();
                                    
                                    if (xmlDescription !== expectedType.description) {
                                        inconsistencies.push({
                                            type: 'DESCRIPTION_MISMATCH',
                                            jsonFile: jsonFileName,
                                            jsonPath: userType.path,
                                            jsonCode: userType.code,
                                            xmlFile: xmlFile.name,
                                            expectedDescription: expectedType.description,
                                            actualDescription: xmlDescription,
                                            lineNumber: getXmlLineNumber(xmlContent, node)
                                        });
                                    }
                                });
                            }
                        };
                        
                        xmlReader.readAsText(xmlFile);
                    });
                    
                    if (!foundInXml && expectedType.required) {
                        inconsistencies.push({
                            type: 'MISSING_IN_XML',
                            jsonFile: jsonFileName,
                            jsonPath: userType.path,
                            jsonCode: userType.code,
                            expectedDescription: expectedType.description,
                            message: `Tipo de usuario requerido no encontrado en XML: ${userType.code} (${expectedType.description})`
                        });
                    }
                });
                
                // Actualizar progreso
                filesProcessed++;
                updateValidationProgress(filesProcessed, totalFiles);
                
                // Si es el último archivo, mostrar resultados
                if (filesProcessed === totalFiles) {
                    if (inconsistencies.length > 0) {
                        showInconsistencies(inconsistencies);
                    } else {
                        validationProgress.innerHTML = `
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                Todos los tipos de usuario coinciden correctamente entre JSON y XML
                            </div>
                        `;
                    }
                }
                
            } catch (error) {
                console.error('Error procesando archivo JSON:', jsonFile.name, error);
                validationProgress.innerHTML += `
                    <div class="alert alert-danger mt-2">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error procesando ${jsonFile.name}: ${error.message}
                    </div>
                `;
                
                // Actualizar progreso incluso si hay error
                filesProcessed++;
                updateValidationProgress(filesProcessed, totalFiles);
            }
        };
        
        reader.readAsText(jsonFile);
    });
}

function validateJsonUserTypesOnly(jsonFiles, expectedUserTypes) {
    const inconsistencies = [];
    let filesProcessed = 0;
    const totalFiles = jsonFiles.length;

    // Mostrar progreso
    const validationProgress = document.createElement('div');
    validationProgress.className = 'alert alert-info';
    validationProgress.innerHTML = `
        <div class="d-flex justify-content-between">
            <span>Validando tipos de usuario en archivos JSON...</span>
            <span id="validationProgressText">0/${totalFiles}</span>
        </div>
        <div class="progress mt-2">
            <div id="validationProgressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" style="width: 0%"></div>
        </div>
    `;
    errorDetailsSection.innerHTML = '';
    errorDetailsSection.appendChild(validationProgress);

    jsonFiles.forEach(jsonFile => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const jsonFileName = jsonFile.name;
                
                // Buscar todos los tipos de usuario en el JSON
                const jsonUserTypes = findUserTypesInJson(jsonData);
                
                // Validar cada tipo de usuario encontrado
                jsonUserTypes.forEach(userType => {
                    const expectedType = expectedUserTypes[userType.code];
                    
                    if (!expectedType) {
                        inconsistencies.push({
                            type: 'UNKNOWN_CODE',
                            jsonFile: jsonFileName,
                            jsonPath: userType.path,
                            jsonCode: userType.code,
                            message: `Código de tipo de usuario no reconocido: ${userType.code}`
                        });
                    }
                    // Validar que los tipos requeridos tengan valores válidos
                    else if (expectedType.required && !userType.code) {
                        inconsistencies.push({
                            type: 'INVALID_CODE',
                            jsonFile: jsonFileName,
                            jsonPath: userType.path,
                            jsonCode: userType.code,
                            message: `Tipo de usuario requerido con valor inválido: ${userType.code}`
                        });
                    }
                });
                
            } catch (error) {
                console.error('Error procesando archivo JSON:', jsonFile.name, error);
                inconsistencies.push({
                    type: 'PROCESSING_ERROR',
                    jsonFile: jsonFile.name,
                    message: `Error procesando archivo: ${error.message}`
                });
            } finally {
                filesProcessed++;
                updateValidationProgress(filesProcessed, totalFiles);
                
                if (filesProcessed === totalFiles) {
                    if (inconsistencies.length > 0) {
                        showInconsistencies(inconsistencies);
                    } else {
                        validationProgress.innerHTML = `
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                Todos los tipos de usuario en los archivos JSON son válidos
                            </div>
                        `;
                    }
                }
            }
        };
        
        reader.readAsText(jsonFile);
    });
}

    function findUserTypesInJson(obj, path = '', results = []) {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                findUserTypesInJson(item, `${path}[${index}]`, results);
            });
        } else if (obj && typeof obj === 'object') {
            if (obj.hasOwnProperty('tipoUsuario') && obj.tipoUsuario) {
                results.push({
                    code: obj.tipoUsuario,
                    path: path ? `${path}.tipoUsuario` : 'tipoUsuario'
                });
            }
            
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const newPath = path ? `${path}.${key}` : key;
                    findUserTypesInJson(obj[key], newPath, results);
                }
            }
        }
        return results;
    }

    function getXmlLineNumber(xmlContent, node) {
        const xmlString = new XMLSerializer().serializeToString(node);
        const nodeIndex = xmlContent.indexOf(xmlString);
        if (nodeIndex === -1) return 'N/A';
        
        const lines = xmlContent.substring(0, nodeIndex).split('\n');
        return lines.length;
    }

    function updateValidationProgress(processed, total) {
        const percent = Math.round((processed / total) * 100);
        const progressText = document.getElementById('validationProgressText');
        const progressBar = document.getElementById('validationProgressBar');
        
        if (progressText) progressText.textContent = `${processed}/${total}`;
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.setAttribute('aria-valuenow', percent);
        }
    }

    function showInconsistencies(inconsistencies) {
        const inconsistenciesContainer = document.getElementById('inconsistenciesContainer');
        
        if (!inconsistenciesContainer) {
            // Crear contenedor si no existe
            const container = document.createElement('div');
            container.id = 'inconsistenciesContainer';
            container.className = 'card mt-4';
            container.innerHTML = `
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">Inconsistencias en Tipos de Usuario</h5>
                </div>
                <div class="card-body">
                    <div id="inconsistenciesList"></div>
                </div>
            `;
            
            // Agregar al dashboard o sección de resultados
            const resultsSection = document.getElementById('transformResults') || document.getElementById('dashboardSection');
            resultsSection.appendChild(container);
        }
        
        const listElement = document.getElementById('inconsistenciesList');
        listElement.innerHTML = '';
        
        // Agrupar inconsistencias por archivo JSON
        const groupedByFile = {};
        inconsistencies.forEach(issue => {
            if (!groupedByFile[issue.jsonFile]) {
                groupedByFile[issue.jsonFile] = [];
            }
            groupedByFile[issue.jsonFile].push(issue);
        });
        
        // Mostrar inconsistencias agrupadas
        for (const fileName in groupedByFile) {
            const fileIssues = groupedByFile[fileName];
            const fileSection = document.createElement('div');
            fileSection.className = 'mb-4';
            fileSection.innerHTML = `
                <h6 class="text-danger">
                    <i class="fas fa-file-code me-2"></i>${fileName}
                </h6>
                <div class="file-issues-container"></div>
            `;
            
            const issuesContainer = fileSection.querySelector('.file-issues-container');
            
            fileIssues.forEach((issue, index) => {
                const issueElement = document.createElement('div');
                issueElement.className = 'alert alert-danger mb-3';
                
                if (issue.type === 'DESCRIPTION_MISMATCH') {
                    issueElement.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <strong>Descripción no coincide</strong>
                            <span class="badge bg-dark">Línea XML: ${issue.lineNumber || 'N/A'}</span>
                        </div>
                        <hr>
                        <p><strong>Ruta en JSON:</strong> ${issue.jsonPath}</p>
                        <p><strong>Código tipo usuario:</strong> ${issue.jsonCode}</p>
                        <p><strong>Archivo XML:</strong> ${issue.xmlFile}</p>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-header py-1">Descripción esperada</div>
                                    <div class="card-body p-2">
                                        ${issue.expectedDescription}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-header py-1">Descripción encontrada</div>
                                    <div class="card-body p-2">
                                        ${issue.actualDescription}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (issue.type === 'MISSING_IN_XML') {
                    issueElement.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <strong>Tipo de usuario no encontrado en XML</strong>
                            <span class="badge bg-dark">${issue.jsonCode}</span>
                        </div>
                        <hr>
                        <p><strong>Ruta en JSON:</strong> ${issue.jsonPath}</p>
                        <p><strong>Descripción esperada:</strong> ${issue.expectedDescription}</p>
                        <p class="text-danger">No se encontró este código en ningún archivo XML</p>
                    `;
                }
                
                issuesContainer.appendChild(issueElement);
            });
            
            listElement.appendChild(fileSection);
        }
    }

    function addValidationButton() {
        const button = document.createElement('button');
        button.id = 'validateUserTypesBtn';
        button.className = 'btn btn-warning mb-3';
        button.innerHTML = '<i class="fas fa-user-check me-2"></i>Validar Tipos de Usuario';
        button.addEventListener('click', validateUserTypesConsistency);
        
        // Agregar al dashboard (ajusta según tu estructura)
        const dashboardHeader = document.querySelector('#dashboardSection .dashboard-header');
        if (dashboardHeader) {
            dashboardHeader.appendChild(button);
        } else {
            document.getElementById('dashboardSection').insertBefore(button, document.querySelector('#dashboardSection .row'));
        }
    }

    // ======================================================================
    // FUNCIONES PARA BÚSQUEDA DE INTERNACIÓN ADULTOS
    // ======================================================================

    // ======================================================================
// FUNCIONES PARA BÚSQUEDA DE INTERNACIÓN
// ======================================================================

function buscarInternacion() {
    if (jsonFiles.length === 0) {
        alert('No hay archivos cargados para buscar');
        return;
    }

    const textosBusqueda = [
        "INTERNACION", // Buscar cualquier ocurrencia de "INTERNACION"
        "INTERNACIÓN"  // También considerar posible acentuación
    ];
    
    const resultados = [];
    let archivosProcesados = 0;
    let totalOcurrencias = 0;

    // Crear contenedor para resultados
    const resultadosContainer = document.createElement('div');
    resultadosContainer.id = 'resultadosInternacionContainer';
    resultadosContainer.className = 'card mt-4';
    resultadosContainer.innerHTML = `
        <div class="card-header bg-info text-white">
            <h5 class="mb-0"><i class="fas fa-procedures me-2"></i>Resultados de búsqueda: "Internación"</h5>
        </div>
        <div class="card-body">
            <div id="resultadosInternacionList" class="list-group"></div>
        </div>
    `;

    // Mostrar progreso
    const progressContainer = document.createElement('div');
    progressContainer.className = 'alert alert-info';
    progressContainer.innerHTML = `
        <div class="d-flex justify-content-between">
            <span>Buscando en archivos...</span>
            <span id="busquedaProgressText">0/${jsonFiles.length}</span>
        </div>
        <div class="progress mt-2">
            <div id="busquedaProgressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" style="width: 0%"></div>
        </div>
    `;

    resultadosContainer.querySelector('#resultadosInternacionList').appendChild(progressContainer);
    errorDetailsSection.innerHTML = '';
    errorDetailsSection.appendChild(resultadosContainer);

    // Procesar cada archivo JSON
    jsonFiles.forEach(file => {
        if (!file.name.toLowerCase().endsWith('.json')) {
            archivosProcesados++;
            updateBusquedaProgress(archivosProcesados, jsonFiles.length);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const encontrados = buscarEnTodoElJSON(jsonData, textosBusqueda);
                
                if (encontrados.length > 0) {
                    totalOcurrencias += encontrados.length;
                    resultados.push({
                        archivo: file.name,
                        path: file.webkitRelativePath || file.name,
                        contenido: jsonData, // Guardamos el JSON completo para mostrar detalles
                        ocurrencias: encontrados
                    });
                }
                
            } catch (error) {
                console.error('Error procesando archivo:', file.name, error);
            } finally {
                archivosProcesados++;
                updateBusquedaProgress(archivosProcesados, jsonFiles.length);
                
                // Si es el último archivo, mostrar resultados
                if (archivosProcesados === jsonFiles.length) {
                    mostrarResultadosBusqueda(resultados, totalOcurrencias);
                }
            }
        };
        
        reader.readAsText(file);
    });
}

// Función mejorada para buscar en todo el JSON, no solo en otrosServicios
function buscarEnTodoElJSON(data, textosBusqueda, path = '') {
    const resultados = [];
    
    if (typeof data === 'string') {
        // Buscar en strings
        textosBusqueda.forEach(texto => {
            if (data.toUpperCase().includes(texto.toUpperCase())) {
                resultados.push({
                    valor: data,
                    path: path,
                    tipo: 'string'
                });
            }
        });
    } else if (Array.isArray(data)) {
        // Buscar en arrays
        data.forEach((item, index) => {
            resultados.push(...buscarEnTodoElJSON(item, textosBusqueda, `${path}[${index}]`));
        });
    } else if (data && typeof data === 'object') {
        // Buscar en objetos
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const newPath = path ? `${path}.${key}` : key;
                resultados.push(...buscarEnTodoElJSON(data[key], textosBusqueda, newPath));
            }
        }
    }
    
    return resultados;
}

function mostrarResultadosBusqueda(resultados, totalOcurrencias) {
    const resultadosList = document.getElementById('resultadosInternacionList');
    resultadosList.innerHTML = '';
    
    if (resultados.length === 0) {
        resultadosList.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-info-circle me-2"></i>
                No se encontró el término "INTERNACION" en ningún archivo.
            </div>
        `;
        return;
    }
    
    // Resumen de búsqueda
    const resumen = document.createElement('div');
    resumen.className = 'alert alert-success mb-3';
    resumen.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <i class="fas fa-check-circle me-2"></i>
                <strong>Resultados encontrados:</strong> ${totalOcurrencias} ocurrencias en ${resultados.length} archivos
            </div>
            <button class="btn btn-sm btn-outline-primary" id="exportarResultadosBtn">
                <i class="fas fa-file-export me-1"></i> Exportar
            </button>
        </div>
    `;
    resultadosList.appendChild(resumen);
    
    // Agregar evento para exportar resultados
    resumen.querySelector('#exportarResultadosBtn').addEventListener('click', () => {
        exportarResultados(resultados);
    });
    
    // Mostrar resultados por archivo
    resultados.forEach(resultado => {
        const resultadoItem = document.createElement('div');
        resultadoItem.className = 'list-group-item';
        
        // Contador de ocurrencias por tipo
        const ocurrenciasPorCampo = {};
        resultado.ocurrencias.forEach(occ => {
            const campo = occ.path.split('.').pop() || 'raíz';
            if (!ocurrenciasPorCampo[campo]) {
                ocurrenciasPorCampo[campo] = 0;
            }
            ocurrenciasPorCampo[campo]++;
        });
        
        const camposResumen = Object.entries(ocurrenciasPorCampo)
            .map(([campo, count]) => `${campo}: ${count}`)
            .join(', ');
        
        resultadoItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h6 class="mb-1">
                        <i class="fas fa-file-code text-primary me-2"></i>
                        ${resultado.path}
                    </h6>
                    <div class="small text-muted mb-2">
                        <strong>Ocurrencias:</strong> ${resultado.ocurrencias.length} 
                        (${camposResumen})
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-primary" data-file="${resultado.archivo}">
                    <i class="fas fa-search me-1"></i> Detalles
                </button>
            </div>
        `;
        
        // Agregar evento para mostrar detalles
        resultadoItem.querySelector('button').addEventListener('click', () => {
            mostrarDetallesArchivo(resultado);
        });
        
        resultadosList.appendChild(resultadoItem);
    });
}

function mostrarDetallesArchivo(resultado) {
    // Limpiar detalles previos
    const detallesPrevios = document.querySelectorAll('.detalles-archivo');
    detallesPrevios.forEach(el => el.remove());
    
    const detallesContainer = document.createElement('div');
    detallesContainer.className = 'detalles-archivo card mt-3';
    detallesContainer.innerHTML = `
        <div class="card-header bg-light">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                    <i class="fas fa-file-alt me-2"></i>
                    Detalles de ${resultado.path}
                </h5>
                <button class="btn btn-sm btn-outline-secondary cerrar-detalles">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <h6 class="mb-3">
                <i class="fas fa-list-ul me-2"></i>
                ${resultado.ocurrencias.length} ocurrencias encontradas
            </h6>
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Campo</th>
                            <th>Ruta</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resultado.ocurrencias.map(occ => `
                            <tr>
                                <td>${occ.path.split('.').pop() || 'raíz'}</td>
                                <td><code>${occ.path}</code></td>
                                <td>${occ.valor.length > 50 ? occ.valor.substring(0, 50) + '...' : occ.valor}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Agregar evento para cerrar detalles
    detallesContainer.querySelector('.cerrar-detalles').addEventListener('click', () => {
        detallesContainer.remove();
    });
    
    // Insertar después del elemento del archivo
    const fileItem = document.querySelector(`button[data-file="${resultado.archivo}"]`).closest('.list-group-item');
    fileItem.parentNode.insertBefore(detallesContainer, fileItem.nextSibling);
}

function exportarResultados(resultados) {
    if (resultados.length === 0) {
        alert('No hay resultados para exportar');
        return;
    }

    // Crear contenido CSV
    let csvContent = "Archivo,Ruta,Campo,Valor\n";
    
    resultados.forEach(resultado => {
        resultado.ocurrencias.forEach(occ => {
            const campo = occ.path.split('.').pop() || 'raíz';
            const valor = occ.valor.replace(/"/g, '""'); // Escapar comillas
            csvContent += `"${resultado.path}","${occ.path}","${campo}","${valor}"\n`;
        });
    });
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'resultados_internacion.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateBusquedaProgress(processed, total) {
    const percent = Math.round((processed / total) * 100);
    const progressText = document.getElementById('busquedaProgressText');
    const progressBar = document.getElementById('busquedaProgressBar');
    
    if (progressText) progressText.textContent = `${processed}/${total}`;
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent);
    }
}

function addBusquedaButton() {
    const button = document.createElement('button');
    button.id = 'buscarInternacionBtn';
    button.className = 'btn btn-info mb-3';
    button.innerHTML = '<i class="fas fa-procedures me-2"></i>Buscar Internación';
    button.addEventListener('click', buscarInternacion);
    
    // Agregar junto al botón de validación de tipos de usuario
    const dashboardHeader = document.querySelector('#dashboardSection .dashboard-header');
    if (dashboardHeader) {
        dashboardHeader.appendChild(button);
    } else {
        document.getElementById('dashboardSection').insertBefore(button, document.querySelector('#dashboardSection .row'));
    }
}

    // Inicializar en DOMContentLoaded
    setTimeout(() => {
        addValidationButton();
        addBusquedaButton();
    }, 1000);

    // Inicializar dashboard
    updateDashboardStats();
    renderHistory();
});