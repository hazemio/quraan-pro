import axios from 'axios'

const BASE = 'https://api.alquran.cloud/v1'
const ARABIC = 'quran-uthmani'
const TRANSLATION = 'en.asad'
const AUDIO = 'ar.alafasy'

const api = axios.create({ baseURL: BASE, timeout: 10000 })

export const QuranService = {
  getSurahs: () => api.get('/surah'),

  getSurah: (number) =>
    api.get(`/surah/${number}/editions/${ARABIC},${TRANSLATION}`),

  getSurahAudio: (number) =>
    api.get(`/surah/${number}/${AUDIO}`),

  getAyah: (reference, edition = ARABIC) =>
    api.get(`/ayah/${reference}/${edition}`),

  search: (query, surah = 'all') =>
    api.get(`/search/${encodeURIComponent(query)}/${surah}/ar`),

  getJuz: (number) =>
    api.get(`/juz/${number}/${ARABIC}`),
}

// AlHadith public API
const HADITH_BASE = 'https://api.hadith.gading.dev'
const hadithApi = axios.create({ baseURL: HADITH_BASE, timeout: 10000 })

export const HadithService = {
  getBooks: () => hadithApi.get('/books'),
  getBook: (book, page = 1, limit = 20) =>
    hadithApi.get(`/books/${book}?page=${page}&limit=${limit}`),
}

export default api
