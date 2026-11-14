import { api } from "../lib/api";

const categoryMap = {
  akademik: "academic",
  kegiatan: "activity",
  libur: "holiday",
  penting: "important",
  prestasi: "achievement",
  info: "info",
};

const audienceMap = {
  semua: "all",
  siswa: "siswa",
  guru: "guru",
  wali: "wali",
};

const priorityMap = {
  rendah: "low",
  normal: "normal",
  penting: "important",
  urgent: "urgent",
};

export async function listAnnouncements(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  const response = await api(`/announcements${query ? `?${query}` : ""}`);
  return response.data;
}

export async function getAnnouncementById(id) {
  const response = await api(`/announcements/${id}`);
  return response.data;
}

export async function createAnnouncement(form) {
  const response = await api("/announcements", {
    method: "POST",
    body: {
      category: categoryMap[form.jenis] ?? form.jenis,
      title: form.judul.trim(),
      publish_date: form.tanggal,
      end_date: form.tanggalSelesai || form.end_date || null,
      target_audience: audienceMap[form.target] ?? form.target,
      class_id: form.class_id || null,
      priority: priorityMap[form.prioritas] ?? form.prioritas,
      description: form.deskripsi.trim(),
      status: form.status ?? "published",
    },
  });

  return response.data;
}

export async function updateAnnouncement(id, body) {
  const response = await api(`/announcements/${id}`, {
    method: "PUT",
    body,
  });
  return response.data;
}

export async function deleteAnnouncement(id) {
  return api(`/announcements/${id}`, { method: "DELETE" });
}

export async function getCalendarSummary(month) {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  const response = await api(`/calendar/summary${query}`);
  return response.data;
}

export async function getCalendarEvents(month) {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  const response = await api(`/calendar/events${query}`);
  return response.data;
}
