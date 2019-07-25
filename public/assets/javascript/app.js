// $( document ).ready(function() {
//     console.log( "ready!" );
//     $("#bookmark-btn").on("click", function() {
//         var id = $(this).data();
//         console.log(id);
//         console.log("Bookmarked article");
//         $.ajax("/api/articles/" + id, {
//         type: "PUT",
//       }).then(
//         function() {
//           console.log("saved article");
//         }
//       );
//     });
// });
function showcomment(event) {
	event.preventDefault();
	var id = $(this).attr("value");
	$("#addcomment").fadeIn(300).css("display", "flex");
	$("#add-comment").attr("value", id);
	$.get("/" + id, function(data) {
		$("#article-title").text(data.title);
		$.get("/comment/" + id, function(data) {
			if (data) {
				$("#comment-title").val(data.title);
				$("#comment-body").val(data.body);
			}
		});
	});

}

function addcomment(event) {
	event.preventDefault();
	var id = $(this).attr("value");
	var obj = {
		title: $("#comment-title").val().trim(),
		body: $("#comment-body").val().trim()
	};
	$.post("/comment/" + id, obj, function(data) {
		window.location.href = "/saved";
	});
}

function changestatus() {
	var status = $(this).attr("value");
	if (status === "Saved") {
		$(this).html("Unsave");
	}
};

function changeback() {
	$(this).html($(this).attr("value"));
}

$(document).on("click", ".addcomment-button", showcomment);
$(document).on("click", "#add-comment", addcomment);
$(".status").hover(changestatus, changeback);
$("#close-comment").on("click", function() {
	$("#addcomment").fadeOut(300);
});
