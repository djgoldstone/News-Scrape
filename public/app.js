$( document ).ready(function() {
    console.log( "ready!" );
    $("#bookmark-btn").on("click", function() {
        var id = $(this).data();
        console.log(id);
        console.log("Bookmarked article");
        $.ajax("/api/articles/" + id, {
        type: "PUT",
      }).then(
        function() {
          console.log("saved article");
        }
      );
    });
});
