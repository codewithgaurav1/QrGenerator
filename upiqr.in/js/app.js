(function($) {
    $.query = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
);

/*$.validator.addMethod(
	'mcc',
	function(value, element, name) {
		return $(name + ':checked').length == 0 || /^[0-9]{4}$/.test(value);
	}
)*/

function check(object, field, regex) {
	return object.hasOwnProperty(field) && object[field] && regex.test(object[field]);
}

function formHandler() {
	let urlParams = {
		vpa: $('#vpa').val(),
		name: $('#name').val(),

	}
	/*if($('#merchant_qr:checked').length > 0) {
		url = url + '&mc=' + $('#mcc').val();
	}*/
	/*if($('#note').val()) {
		urlParams['note'] = $('#note').val();
	}*/
	location.assign(location.origin + "?" + $.param(urlParams));
}

function loadFields() {
	var form = $('form');
	for(var field in $.query) {
		$('#' + field).val($.query[field]);
	}
}

$(document).ready(function() {
	//Materialize shit
	$('.tooltipped').tooltip({delay: 50});
	$('ul.tabs').tabs();
	$('.print').on('click', function(e) { window.print(); });
	$('form').submit(function(e) {
		e.preventDefault();
	})
	.validate({
			rules: {
				name: {
					required: true,
					minlength: 1,
					maxlength: 99
				},
				vpa: {
					required: true,
					regex: '^.{2,}@.{2,}$'
				}/*,
				note : {
					maxlength: 50
				}*//*,
				mcc: {
					mcc: '#merchant_qr'
				}*/
			},
			messages: {
				name: 'Payee name must be between 1-99 characters',
				vpa: 'Payee VPA must be &lt;prefix&gt;@&lt;psp&gt;. Prefix between 2-255 characters'/*,
				note: 'Note can be [0-50] characters'*//*,
				mcc: '4 digit MCC must be provided for merchant'*/
			},
			errorElement : 'div',
	        errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if (placement) {
	            	$(placement).append(error)
				} else {
	            	error.insertAfter(element);
				}
	        },
			submitHandler: function(form) {
				window.location ='?'
					+ $(form).serializeArray()
							.map(function(data) {
								return encodeURI(data.name + '=' + data.value)
							}).reduce(function(uri, part) {
								return uri + '&' + part
							});
				return false;
			},
			invalidHandler: function() {
				Materialize.toast("Please fill up all required parameters.", 2000)
			}
	});

	$.get('/api', function(data) {
		$('#api').html(data);
		$('#api').find('table').addClass('responsive-table');
	});

	$('.poster').magnificPopup({
	  type: 'iframe',
	  verticalFit: true,
	  enableEscapeKey: true
	  // other options
	});
	$('.qrcode-display').on('click', function() {
		$('.poster').click();
	})
	var clipboard = new Clipboard('.link-qr');

	clipboard.on('success', function(e) {
	    Materialize.toast('Link Copied!!', 2000);
	});
	
});
