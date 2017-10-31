


var listname;




$(document).ready(function(){


	$("#submit").on("click", function(){
		event.preventDefault();
		listname = $("#listItem").val().trim();
		var button = $("<button>").addClass("btn-lg btn-default listSearch");
		button.attr("data-title", listname);
		button.html(listname);
		var deleteButton = $("<button>").addClass("btn-sm btn-danger deleteButton");
		deleteButton.html("X");
		deleteButton.attr("data-title", listname);
		var div = $("<div>");
		div.addClass("text-left buttonDiv");
		div.attr("data-title", listname);
		div.append(deleteButton);
		div.append(button);
		$("#list").append(div);
		$("#listItem").val("");
		
	});


	$(document).on("click",".deleteButton", function(){
		var deleteLabel = $(".buttonDiv").attr("data-title");
		$(".listSearch").attr("data-title", deleteLabel).addClass("hidden");
		$(".deleteButton").attr("data-title", deleteLabel).addClass("hidden");

	})
	
});

