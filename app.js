const proyek = [
  { nama: "Desain Logo",  klien: "PT Maju Jaya",   nominal: 4500000, status: "terlambat", keterangan: "Terlambat 12 hari" },
  { nama: "Website Toko", klien: "Kopi Senja",     nominal: 6000000, status: "menunggu",  keterangan: "Jatuh tempo 25 Okt" },
  { nama: "Foto Produk",  klien: "Studio Rasa",    nominal: 4000000, status: "menunggu",  keterangan: "Jatuh tempo 2 Nov" },
  { nama: "Poster Event", klien: "Komunitas Lari", nominal: 2500000, status: "lunas",     keterangan: "Lunas" }
];

const transaksi = [];

const kategoriPerJenis = {
  pemasukan:   ["Pembayaran proyek", "DP proyek", "Bonus", "Lainnya"],
  pengeluaran: ["Software & langganan", "Peralatan", "Transport", "Makan", "Pajak", "Lainnya"]
};

const $ = id => document.getElementById(id);
const rupiah = n => "Rp " + n.toLocaleString("id-ID");

function tampilkan() {
  const belum = proyek.filter(p => p.status !== "lunas");
  const telat = proyek.filter(p => p.status === "terlambat");

  $("total").textContent = rupiah(belum.reduce((s, p) => s + p.nominal, 0));
  $("info").textContent = belum.length + " proyek menunggu · " + telat.length + " terlambat";

  $("daftar").replaceChildren(...proyek.map((p, i) => {
    const kartu = $("tpl-proyek").content.cloneNode(true);
    const el = kartu.querySelector(".proyek");

    el.classList.add(p.status);
    kartu.querySelector(".nama").textContent = p.nama;
    kartu.querySelector(".klien").textContent = p.klien;
    kartu.querySelector(".nominal").textContent = rupiah(p.nominal);
    kartu.querySelector(".status").textContent = p.keterangan;

    const btnPengingat = kartu.querySelector(".btn-pengingat");
    btnPengingat.hidden = p.status !== "terlambat";
    btnPengingat.onclick = () => kirimPengingat(i);
    kartu.querySelector(".btn-hapus").onclick = () => hapusProyek(i);

    return kartu;
  }));
}

function kirimPengingat(i) {
  alert("Pengingat dikirim ke " + proyek[i].klien);
}


function isiKategori() {
  $("kategori").replaceChildren(
    ...kategoriPerJenis[$("jenis").value].map(k => new Option(k))
  );
}

function tambahTransaksi() {
  $("form-transaksi").reset();
  $("id").value = "";
  $("tanggal").value = new Date().toISOString().slice(0, 10);
  isiKategori();
  $("dialog-transaksi").showModal();
}

function hapusProyek(i) {
    if (confirm("Apakah anda yakin mau menghapus proyek " + proyek[i].nama + "?")) {
        proyek.splice(i, 1);
        tampilkan();
    }
}

function tutupTransaksi() {
  $("dialog-transaksi").close();
}

function simpanTransaksi(e) {
  e.preventDefault();
  transaksi.unshift({
    tanggal: $("tanggal").value,
    jenis: $("jenis").value,
    kategori: $("kategori").value,
    nominal: Number($("nominal").value),
    catatan: $("catatan").value.trim()
  });
  transaksi.sort((x, y) => y.tanggal.localeCompare(x.tanggal));
  tampilkanTransaksi();
  tutupTransaksi();
}

function tampilkanTransaksi() {
  $("kosong-transaksi").hidden = transaksi.length > 0;

  $("daftar-transaksi").replaceChildren(...transaksi.map(t => {
    const baris = $("tpl-transaksi").content.cloneNode(true);
    const tanggal = new Date(t.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    baris.querySelector(".transaksi").classList.add(t.jenis);
    baris.querySelector(".kategori").textContent = t.kategori;
    baris.querySelector(".info").textContent = tanggal + (t.catatan ? " · " + t.catatan : "");
    baris.querySelector(".jumlah").textContent = (t.jenis === "pengeluaran" ? "-" : "+") + rupiah(t.nominal);

    return baris;
  }));
}

$("jenis").addEventListener("change", isiKategori);
$("form-transaksi").addEventListener("submit", simpanTransaksi);

tampilkan();
tampilkanTransaksi();