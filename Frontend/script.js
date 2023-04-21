let desde = 0,
  ultimaURL = "",
  busquedaRealizada = "";
var loading = document.getElementById("loading-overlay");
(loading.style.display = "none"),
  $(function () {
    $.ajax({
      url: "https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde=0&busqueda=",
      type: "GET",
      data: "",
      success: function (e) {
        console.log(e), mostrarNoticias(e);
      },
    }),
      0 == desde &&
        $.each($("a.moveLeft"), function (e, a) {
          $(this).css("pointer-events", "none"),
            $(this).css("cursor", "not-allowed");
        }),
      $.ajax({
        url: "https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde=20&busqueda=",
        type: "GET",
        data: "",
        success: function (e) {
          0 == e.length &&
            $.each($("a.moveRight"), function (e, a) {
              $(this).css("pointer-events", "none"),
                $(this).css("cursor", "not-allowed");
            });
        },
      });
  });
const exmodal = document.getElementById("exMainModal"),
  abrirModal = () => {
    exmodal.showModal();
  },
  cerrarModal = () => {
    exmodal.close();
  };
function buscar() {
  loading.style.display = "block";
  var e = document.getElementById("search").value;
  (busquedaRealizada = e), (desde = 0);
  var a = document.getElementById("styledSelect1"),
    t = desde + 20;
  $.ajax({
    url:
      "https://rssapi-production.up.railway.app/noticias/fecha?busqueda=" +
      busquedaRealizada +
      "&limite=20&desde=" +
      desde,
    type: "GET",
    success: function (e) {
      (loading.style.display = "none"), mostrarNoticias(e);
    },
  }),
    "" != e
      ? (a.style.display = "none")
      : ((a.style.display = "block"), (a.value = "fecha")),
    $.each($("a.moveRight"), function (e, a) {
      $(this).css("pointer-events", "all"), $(this).css("cursor", "allowed");
    }),
    $.ajax({
      url:
        "https://rssapi-production.up.railway.app/noticias/fecha?busqueda=" +
        busquedaRealizada +
        "&limite=20&desde=" +
        t,
      type: "GET",
      data: "",
      success: function (e) {
        (loading.style.display = "none"),
          0 == e.length &&
            $.each($("a.moveRight"), function (e, a) {
              $(this).css("pointer-events", "none"),
                $(this).css("cursor", "not-allowed");
            });
      },
    }),
    (loading.style.display = "none");
}
function ajaxActualizar(e) {
  return (
    $.ajax({
      url: "https://rssapi-production.up.railway.app/rss",
      type: "DELETE",
      success: function (a) {
        e.forEach((e) => {
          ajaxMethodUpdate(e);
        });
      },
    }),
    "finalizado"
  );
}
function ajaxMethodUpdate(e) {
  const a = { url: e.url };
  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: "POST",
    data: a,
    success: function (e) {},
  });
}
$("#btnAgregarModal").click(function () {
  exmodal.showModal();
}),
  $("#btnClose").click(function () {
    cerrarModal();
  }),
  $("#btnCerrarModal").click(function () {
    cerrarModal();
  }),
  (document.getElementById("search").onsearch = function () {
    buscar();
  }),
  $("#btnActualizar").click(function () {
    Swal.fire({
      title: "¿Quiere actualizar las noticias?",
      background: "#373b69",
      color: "#fff",
      icon: "warning",
      showDenyButton: !0,
      confirmButtonText: "Actualizar",
      denyButtonText: "Cancelar",
      allowOutsideClick: !1,
    }).then((e) => {
      e.isConfirmed &&
        ((loading.style.display = "block"),
        $.ajax({
          url: "https://rssapi-production.up.railway.app/rss",
          type: "PATCH",
          success: function (e) {
            loading.style.display = "none";
            var a = ajaxActualizar(e);
            console.log(a),
              "finalizado" == a
                ? Swal.fire({
                    title: "Se han actualizado las noticias!",
                    background: "#373b69",
                    color: "#fff",
                    icon: "success",
                    allowOutsideClick: !1,
                  }).then((e) => {
                    e.isConfirmed &&
                      setTimeout(function () {
                        location.href = "index.html";
                      }, 500);
                  })
                : Swal.fire(
                    "Ocurrió un error al intentar actualizar las noticias!",
                    "",
                    "error"
                  );
          },
        }));
    });
  });
var imagen = "noticias.jpg";
const mostrarNoticias = (e) => {
  (main.innerHTML = ""),
    e.forEach((e) => {
      const a = new DOMParser()
          .parseFromString(e.html, "text/html")
          .querySelectorAll("img"),
        t = document.createElement("div");
      t.classList.add("noticia"),
        0 != a.length
          ? (t.innerHTML =
              '<img src="' +
              a[0].src +
              '" alt="' +
              e.titulo +
              '"/><div class="noticia-info"><h3>' +
              e.titulo +
              '</h3><span class="' +
              e.fecha +
              '">' +
              e.fecha +
              '</span></div><div class="overview"><h3>Descripción</h3>' +
              e.descripcion +
              '</br><a href="' +
              e.url +
              '">Leer más...</a></div>')
          : (t.innerHTML =
              '<img src="' +
              imagen +
              '" alt="' +
              e.titulo +
              '"/><div class="noticia-info"><h3>' +
              e.titulo +
              '</h3><span class="' +
              e.fecha +
              '">' +
              e.fecha +
              '</span></div><div class="overview"><h3>Descripción</h3>' +
              e.descripcion +
              '</br><a href="' +
              e.url +
              '">Leer más...</a></div>'),
        main.appendChild(t);
    });
};
function ajaxMethod(e, a) {
  const t = { url: e };
  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: "POST",
    data: t,
    success: function (e) {
      $(a).attr("aria-invalid", !1);
    },
    error: function (t) {
      const i = t.responseText;
      var s = JSON.parse(i);
      $(a).attr("aria-invalid", !0),
        s.message == e + " no válida por el parser"
          ? $(a).attr("placeholder", "La URL no pertenece a un RSS")
          : $(a).attr("placeholder", "Ningun Campo puede estar vacío");
    },
  });
}
function ajaxAgregar() {
  var e = document.getElementsByName("title[]");
  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: "DELETE",
    success: function (a) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        ajaxMethod(e[t].value, i);
      }
    },
  });
}
function verificarDatos() {
  let e = "";
  for (
    var a = document.getElementsByName("title[]"), t = 0;
    t < a.length;
    t++
  ) {
    var i = a[t];
    "true" === i.getAttribute("aria-invalid") &&
      (e = e + " '" + i.getAttribute("placeholder") + "'");
  }
  (loading.style.display = "none"),
    "" == e
      ? Swal.fire({
          title: "Se ha(n) añadido el(los) RSS!",
          background: "#373b69",
          icon: "success",
          color: "#fff",
          allowOutsideClick: !1,
        }).then((e) => {
          e.isConfirmed &&
            setTimeout(function () {
              location.href = "index.html";
            }, 500);
        })
      : Swal.fire({
          title: e,
          background: "#373b69",
          icon: "error",
          color: "#fff",
          allowOutsideClick: !1,
        });
}
function filtroSeleccionado() {
  var e = document.getElementById("styledSelect1").value;
  (desde = 0),
    (document.getElementById("search").value = ""),
    $.ajax({
      url:
        "https://rssapi-production.up.railway.app/noticias/" +
        e +
        "?limite=20&desde=" +
        desde +
        "&busqueda=" +
        busquedaRealizada,
      type: "GET",
      data: "",
      success: function (e) {
        mostrarNoticias(e),
          $.each($("a.moveRight"), function (e, a) {
            $(this).css("pointer-events", "all"),
              $(this).css("cursor", "allowed");
          });
      },
    });
}
$("#btnAgregarRSS").click(function () {
  $("#nuevoInput").append(
    '<div id="inputFormRow"><input type="text" name="title[]" placeholder="Ingrese RSS" class="rss"/> <input type="button" id="btnQuitarRSS" value="-" class="btnInteraccion" /></div>'
  );
}),
  $(document).on("click", "#btnQuitarRSS", function () {
    $(this).closest("#inputFormRow").remove();
  }),
  $("#btnAgregar").click(function () {
    cerrarModal(),
      (loading.style.display = "block"),
      ajaxAgregar(),
      setTimeout(verificarDatos, 4e3);
  }),
  $("#btnCerrarModal").click(function () {
    (document.getElementById("rss").value = ""),
      $("#rss").removeAttr("aria-invalid"),
      (document.getElementById("nuevoInput").innerHTML = "");
  }),
  document
    .getElementById("styledSelect1")
    .addEventListener("change", filtroSeleccionado),
  $("#anterior").click(function () {
    var e = document.getElementById("styledSelect1").value;
    console.log(e),
      desde > 0 &&
        ((desde -= 20),
        $.ajax({
          url:
            "https://rssapi-production.up.railway.app/noticias/" +
            e +
            "?limite=20&desde=" +
            desde +
            "&busqueda=" +
            busquedaRealizada,
          type: "GET",
          data: "",
          success: function (e) {
            if ((mostrarNoticias(e), e.length > 0)) {
              var a = document.getElementById("siguiente");
              a.style.removeProperty("pointer-events"),
                a.style.removeProperty("cursor");
            }
          },
        })),
      0 == desde &&
        $.each($("a.moveLeft"), function (e, a) {
          $(this).css("pointer-events", "none"),
            $(this).css("cursor", "not-allowed");
        });
  }),
  $("#siguiente").click(function () {
    desde += 20;
    var e = desde + 20,
      a = document.getElementById("styledSelect1").value;
    if (desde > 0) {
      var t = document.getElementById("anterior");
      t.style.removeProperty("pointer-events", "all"),
        t.style.removeProperty("cursor", "allowed");
    }
    $.ajax({
      url:
        "https://rssapi-production.up.railway.app/noticias/" +
        a +
        "?limite=20&desde=" +
        desde +
        "&busqueda=" +
        busquedaRealizada,
      type: "GET",
      data: "",
      success: function (e) {
        mostrarNoticias(e);
      },
    }),
      $.ajax({
        url:
          "https://rssapi-production.up.railway.app/noticias/" +
          a +
          "?limite=20&desde=" +
          e +
          "&busqueda=" +
          busquedaRealizada,
        type: "GET",
        data: "",
        success: function (e) {
          0 == e.length &&
            $.each($("a.moveRight"), function (e, a) {
              $(this).css("pointer-events", "none"),
                $(this).css("cursor", "not-allowed");
            });
        },
      });
  });
