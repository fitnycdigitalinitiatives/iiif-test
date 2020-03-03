$(document).ready(function() {
  var viewer = OpenSeadragon({
    id: "openseadragon",
    maxZoomPixelRatio: 2,
    prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.1/images/",
    tileSources: "https://fitdil.fitnyc.edu/media/iiif/136269/lb_sc_nef_000006/info.json",
    showNavigator: true,
    navigatorSizeRatio: 0.1,
    controlsFadeDelay: 1000,
    collectionMode: true,
    collectionRows: 4,
    collectionLayout: 'vertical'
  });
  viewer.world.addHandler('add-item', function(event) {
    var items = event.eventSource['_items'];
    $('.thumb').remove();
    for (var i in items) {
      var id = items[i].source['@id'];
      var thumbURL = id + '/full/100,/0/default.jpg';
      var thumbItem = `
      <li class="list-group-item thumb">
        <button type="button" class="close" aria-label="Close" data-index="` + i + `">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="media">
          <img src="` + thumbURL + `" class="mr-3 align-self-center">
          <div class="media-body text-muted align-self-center">
            @id: ` + id + `
          </div>
        </div>
      </li>
      `;
      $('.list-group').append(thumbItem);
    }
    $('.close').click(function() {
      var thisItem = viewer.world.getItemAt($(this).data('index'));
      viewer.world.removeItem(thisItem);
      $(this).parent().remove();
      viewer.viewport.goHome();
    });
    var tiledImage = event.item;
    viewer.addOnceHandler('reset-size', function() {
      viewer.viewport.goHome();
    });
  });
  viewer.world.addHandler('remove-item', function(event) {
    var items = event.eventSource['_items'];
    $('.thumb').remove();
    for (var i in items) {
      var id = items[i].source['@id'];
      var thumbURL = id + '/full/100,/0/default.jpg';
      var thumbItem = `
      <li class="list-group-item thumb">
        <button type="button" class="close" aria-label="Close" data-index="` + i + `">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="media">
          <img src="` + thumbURL + `" class="mr-3 align-self-center">
          <div class="media-body text-muted align-self-center">
            @id: ` + id + `
          </div>
        </div>
      </li>
      `;
      $('.list-group').append(thumbItem);
    }
    $('.close').click(function() {
      var thisItem = viewer.world.getItemAt($(this).data('index'));
      viewer.world.removeItem(thisItem);
      $(this).parent().remove();
      viewer.viewport.goHome();
    });
  });
  viewer.addHandler('add-item-failed', function(event) {
    var alert = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Derp!</strong> Invalid IIIF Endpoint. Please enter a url that leads to a valid info.json file.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    `;
    $('#add-image').after(alert);
  });
  $('#add-image').submit(function(event) {
    event.preventDefault();
    var endpoint = $(this).find('input').val();
    const url = new URL(endpoint);
    if (url.pathname.includes("/data/record/")) {
      endpoint = endpoint.replace("/data/record/", "/media/iiif/") + "info.json"
    }
    viewer.addTiledImage({
      tileSource: endpoint,
      preload: true
    });
    $(this).find('input').val('');
  });
});