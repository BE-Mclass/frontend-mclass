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

export async function listAnnouncements() {
  const response = await api("/announcements");
  return response.data;
}

export async function createAnnouncement(form) {
  const response = await api("/announcements", {
    method: "POST",
    body: {
      category: categoryMap[form.jenis],
      title: form.judul.trim(),
      publish_date: form.tanggal,
      target_audience: audienceMap[form.target],
      priority: priorityMap[form.prioritas],
      description: form.deskripsi.trim(),
      status: "published",
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
