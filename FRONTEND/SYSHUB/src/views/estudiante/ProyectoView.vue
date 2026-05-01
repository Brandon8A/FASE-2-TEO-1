<script setup>
import { ref } from 'vue'

const mostrarModal = ref(false)

const tecnologias = ref(['Python', 'TensorFlow', 'React'])

const nuevaTecnologia = ref('')

const agregarTecnologia = () => {
    if (
        nuevaTecnologia.value.trim() &&
        !tecnologias.value.includes(nuevaTecnologia.value.trim())
    ) {
        tecnologias.value.push(nuevaTecnologia.value.trim())
        nuevaTecnologia.value = ''
    }
}

const eliminarTecnologia = (index) => {
    tecnologias.value.splice(index, 1)
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const publicarProyecto = () => {
    
}
</script>

<template>
    <div class="bg-surface-container-low min-h-screen p-6">

        <!-- HEADER -->
        <section class="mb-10">
            <h1 class="text-4xl font-extrabold text-primary mb-4">
                Centro de Proyectos
            </h1>

            <p class="text-gray-500 mb-6">
                Explora proyectos académicos.
            </p>

            <button @click="mostrarModal = true" 
            class="bg-pink-500 text-white px-6 py-2 rounded-lg">
                Publicar Proyecto
            </button>
        </section>

        <!-- GRID -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- CARD -->
            <div class="bg-white p-6 rounded-xl shadow">
                <h3 class="font-bold text-lg mb-2">
                    Redes Neuronales
                </h3>
                <p class="text-sm text-gray-500">
                    Proyecto de reconocimiento facial.
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow">
                <h3 class="font-bold text-lg mb-2">
                    Blockchain Académico
                </h3>
                <p class="text-sm text-gray-500">
                    Validación de títulos.
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow">
                <h3 class="font-bold text-lg mb-2">
                    IoT Agricultura
                </h3>
                <p class="text-sm text-gray-500">
                    Sensores inteligentes.
                </p>
            </div>

        </section>

    </div>
    <div v-if="mostrarModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#fcf8fb] shadow-2xl">
            <!-- Header -->
            <div class="sticky top-0 bg-[#fcf8fb] border-b border-gray-200 px-8 py-6 z-10">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <span class="text-[#b50079] font-bold tracking-widest uppercase text-xs block mb-2">
                            Nuevo Repositorio
                        </span>

                        <h1 class="text-3xl md:text-4xl font-extrabold text-[#3a5f94] tracking-tight mb-3">
                            Publicar Proyecto Académico
                        </h1>

                        <p class="text-gray-500 max-w-2xl leading-relaxed">
                            Comparte tu investigación y desarrollos con la comunidad de
                            SYSHUB.
                        </p>
                    </div>

                    <button @click="cerrarModal" class="text-gray-500 hover:text-red-500 transition">
                        <span class="material-symbols-outlined text-3xl">close</span>
                    </button>
                </div>
            </div>

            <!-- Body -->
            <div class="p-8 space-y-12">
                <!-- Identificación -->
                <section class="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div class="md:col-span-4">
                        <h3 class="text-xl font-bold text-[#3a5f94]">
                            Identificación
                        </h3>

                        <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                            Define el título y la esencia técnica de tu entrega.
                        </p>
                    </div>

                    <div class="md:col-span-8 space-y-6">
                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-[#3a5f94]">
                                Título del Proyecto
                            </label>

                            <input type="text" placeholder="Ej: Algoritmo de Optimización Cuántica"
                                class="w-full rounded-xl bg-gray-100 border-none px-4 py-3 focus:ring-2 focus:ring-[#b50079] outline-none" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-[#3a5f94]">
                                Descripción del Proyecto
                            </label>

                            <textarea rows="6" placeholder="Describe los objetivos, metodología y resultados..."
                                class="w-full rounded-xl bg-gray-100 border-none px-4 py-3 focus:ring-2 focus:ring-[#b50079] outline-none resize-none"></textarea>
                        </div>
                    </div>
                </section>

                <!-- Categorización -->
                <section class="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div class="md:col-span-4">
                        <h3 class="text-xl font-bold text-[#3a5f94]">
                            Categorización
                        </h3>

                        <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                            Añade tags y herramientas para facilitar la búsqueda.
                        </p>
                    </div>

                    <div class="md:col-span-8 space-y-6">
                        <!-- Stack -->
                        <div class="space-y-4">
                            <label class="block text-sm font-bold text-[#3a5f94]">
                                Stack Tecnológico
                            </label>

                            <div class="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-2xl">
                                <div v-for="(tech, index) in tecnologias" :key="index"
                                    class="flex items-center gap-1 bg-[#3a5f94] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {{ tech }}

                                    <button @click="eliminarTecnologia(index)">
                                        <span class="material-symbols-outlined text-sm">
                                            close
                                        </span>
                                    </button>
                                </div>

                                <input v-model="nuevaTecnologia" @keyup.enter="agregarTecnologia" type="text"
                                    placeholder="Agregar tecnología..."
                                    class="bg-transparent outline-none text-sm min-w-[150px]" />
                            </div>
                        </div>

                        <!-- Tags -->
                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-[#3a5f94]">
                                Etiquetas de Búsqueda
                            </label>

                            <input type="text" placeholder="IA, Machine Learning, Tesis..."
                                class="w-full rounded-xl bg-gray-100 border-none px-4 py-3 focus:ring-2 focus:ring-[#b50079] outline-none" />
                        </div>
                    </div>
                </section>

                <!-- Documentación -->
                <section class="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div class="md:col-span-4">
                        <h3 class="text-xl font-bold text-[#3a5f94]">
                            Documentación
                        </h3>

                        <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                            Sube código fuente, PDFs o demos visuales.
                        </p>
                    </div>

                    <div class="md:col-span-8">
                        <div
                            class="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center bg-white hover:bg-gray-50 transition cursor-pointer">
                            <span class="material-symbols-outlined text-6xl text-[#b50079] mb-4"
                                style="font-variation-settings: 'FILL' 1;">
                                cloud_upload
                            </span>

                            <h4 class="text-lg font-bold text-[#3a5f94] mb-2">
                                Arrastra tus archivos aquí
                            </h4>

                            <p class="text-sm text-gray-500 mb-6">
                                Soporta ZIP, PDF, MP4 o DOCX
                            </p>

                            <button
                                class="bg-[#b50079] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition">
                                Seleccionar Archivos
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-4">
                    <button @click="cerrarModal"
                        class="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-[#3a5f94] hover:bg-gray-100 transition">
                        Cancelar
                    </button>

                    <button @click="publicarProyecto"
                        class="w-full md:w-auto px-10 py-4 bg-[#b50079] text-white rounded-xl font-extrabold text-lg hover:scale-105 transition shadow-lg">
                        Publicar Proyecto
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
</style>