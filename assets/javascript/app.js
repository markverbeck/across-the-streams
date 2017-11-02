


var listname;
var buttonName =[];
// var buttonNumber = 0;




$(document).ready(function(){


	$("#submit").on("click", function(){
		event.preventDefault();
		listname = $("#listItem").val().trim();
		buttonName.push(listname);
		$("#list").empty();
		// buttonNumber ++;
		for (var i = 0; i < buttonName.length; i++) {
			
		
			var button = $("<button>").addClass("btn-lg btn-default listSearch");
			button.attr("data-title", buttonName[i]);
			button.html(buttonName[i]);
			var deleteButton = $("<button>").addClass("btn-sm btn-danger deleteButton");
			deleteButton.html("X");
			deleteButton.attr("id", buttonName[i]);
			var div = $("<div>");
			div.addClass("text-left buttonDiv");
			div.attr("id",buttonName[i]);
			div.append(deleteButton);
			div.append(button);
			$("#list").append(div);
			
			$("#listItem").val("");
		}
	});


	$(document).on("click",".deleteButton", function(){
			console.log($(".buttonDiv").attr("id"));

		

	})

});

