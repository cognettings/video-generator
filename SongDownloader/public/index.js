
$("#songBtn").click( () =>
  {
    console.log("sending: " + $("#song").val())
    $("#ret").empty()
    $.post( "/songSearch", { "query":$("#song").val() })
      .done(function( data ) {
        printResults(data);
    },"json");
  }
);

// function songDownload(url)
// {
//     console.log("downloading " + url)
//     $.post( "/song", { "url":$("#song").val(url) })
//       .done(function( data ) {
//         console.log("download done")
//     },"json");
//   );
// }


function printResults(ret)
{
  console.log(ret)
  ret.forEach((item) => {
    // $("#ret").append("<li><button class=\"dlBtn\" data-url:\"item.url\">"+item.name+"</button></li>")
    $("#ret").append("<li>"+item.name+"</li>")
  });
  $("#ret").append("<a href=\"/songDownload\" download>download</a>")
  // $(".dlBtn").click(printResults(this.data("url")))
}
