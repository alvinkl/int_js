var html;
var current_form = $();
$(document).ready(function() {
	var iframe = $('#preview-mce');
	var iframe_content = iframe.contents().find('#content-iframe');

	setupGeneral();
	setupPreview();
	setupTinyMCE();
});

function setupTinyMCE() {
	var tinymce_view = {
			toolbar: ['alignleft aligncenter alignright alignjustify link'],

			plugins: ['link', 'preview'],
			menubar: '',
		},
		tinymce_settings = {
			selector: '.wysiwig',
			height: '400px',
			resize: false,
			visual: false,
			setup: tinyMceSetup,
		};
	var tinymce_view_2 = {
			toolbar: ['alignleft aligncenter alignright alignjustify link'],

			plugins: ['link', 'preview'],
			menubar: '',
		},
		tinymce_settings_2 = {
			selector: '.wysiwig-footnote',
			height: '100px',
			resize: false,
			visual: false,
			setup: tinyMceFootnoteSetup,
		};

	function tinyMceSetup(editor) {
		var iframe = $('#preview-mce');
		var iframe_content = iframe.contents().find('#content-iframe');

		editor.on('keyup', function() {
			var content = tinymce.activeEditor.getContent();
			var render = html({ content: content });
			iframe_content.html(render);
		});
		editor.on('change', function() {
			var content = tinymce.activeEditor.getContent();
			var render = html({ content: content });
			iframe_content.html(render);
		});
	}

	function tinyMceFootnoteSetup(editor) {
		var iframe = $('#preview-mce');
		var iframe_content = iframe.contents().find('#content-iframe');

		editor.on('keyup', function() {
			var footnote = tinymce.activeEditor.getContent();
			var render = html({ footnote });
			iframe_content.html(render);
		});
		editor.on('change', function() {
			var footnote = tinymce.activeEditor.getContent();
			var render = html({ footnote });
			iframe_content.html(render);
		});
	}

	tinymce.init(Object.assign({}, tinymce_view, tinymce_settings));
	tinymce.init(Object.assign({}, tinymce_view_2, tinymce_settings_2));
}

function setupIframe() {
	var iframe = $('#preview-mce');
	var iframe_content = iframe.contents();
	var addCSS = function(href) {
		iframe_content.find('head').append(
			$('<link />', {
				rel: 'stylesheet',
				href,
				type: 'text/css',
			})
		);
	};

	addCSS('./preview.css');
	addCSS('http://ak-alvin.ndvl/css/dv3-bootstrap-short.css');
	addCSS('http://ak-alvin.ndvl/css/dv3-global-short.css');
	addCSS('http://ak-alvin.ndvl/css/dv3-new-button.css');

	iframe_content.find('body').html(`
        <div class="maincontent-admin maincontent-admin--transparent">
            <h3 class="fs-16 fw-600 mt-5">Info Penjual</h3>
            <div class="maincontent-container">
                <div class="pb-15 pt-5 ">
                    <a class="backto-infolist" href="index.html">
                        <i class="icon svg-chevron-left vertical-middle"></i>
                        <span class="fs-12 fw-600 vertical-middle">Kembali</span>
                    </a>
                    <div id='content-iframe'></div>
                </div>
            </div>
        </div>    
    `);
}

var clearHTML = (function() {
	return {
		banner: {
			desktop: '',
			mobile: '',
		},
		title: '',
		content: '',
		content_images: [],
		promo_code: '',
		buttons: '',
		footnote: '',
	};
})();

function compileHTML(type) {
	var html = {
		banner: {
			desktop: '',
			mobile: '',
		},
		title: '',
		content: '',
		content_images: [],
		promo_code: '',
		buttons: '',
		footnote: '',
	};
	console.log(html);
	return function(newHTML) {
		html = Object.assign({}, html, newHTML);

		var render_promo_code = '';
		if (html.promo_code.length) {
			var promo_func = function() {
				new Clipboard('.copy');
				$('.copy').on('click', function() {
					$(this).html(
						'<i style="color: green">&#10003;</i> Tersalin'
					);
				});
			};

			var render_promo_func = `<script>(${promo_func})()</script>`;
			var promo_code = html.promo_code.toUpperCase();
			render_promo_code = `
				<div class="promo-code-wrapper">
					<h4 class="main-title">Kode Promo</h4>
					<div>
						<div class="promo-code-copy">
							<span class="text">${promo_code}</span>
							<span class="copy" data-clipboard-text="${promo_code}">Salin Kode</span>
						</div>
					</div>
				</div>
				${render_promo_func}
			`;
		}

		var header = '';

		if (html.banner.desktop) {
			header = `
				<div class="info-top-banner info-top-banner--video relative" style="background-image: url(${html
					.banner.desktop});">
				</div>
				`;
			// <button type="button" class="btn-see-video btn-see-video--center btn-see-video--white">
			// 	<img src="https://ecs7.tokopedia.net/img/newtkpd/gold-new/play_btn.png" style="width: 22px;height: 22px;margin-right: 10px;">
			// 	<span style="vertical-align: middle;font-size: 14px;">Lihat Videonya</span>
			// </button>
		}

		var render_content_images = '';
		if (html.content_images.length) {
			render_content_images = html.content_images
				.map(img => `<img src="${img}"/>`)
				.join('');
		}

		var border_content = html.banner.desktop
			? 'no-border-top'
			: 'border-top';
		var contents = `
			${header}
			<div class="border-wrapper ${border_content}">
				<div class="relative pt-20">
					<div class="pl-20 pr-20">
						<span class="fs-12">${type}&nbsp;&sdot;</span>
						<span class="fs-10 muted">%date_time%</span>
					</div>
					<h3 class="info-title">${html.title}</h3>
					<div class="content-text">
						${html.content}
						${render_promo_code}
					</div>
				</div>
				<div style="padding: 0 20px;margin-bottom:10px">
					${render_content_images}
				</div>
				<div class="pl-20 pr-20 clearfix text-center">
						<div class="fs-13 mb-10">${html.footnote}</div>
				</div>
				${html.buttons}
			</div>
		`;

		return contents;
	};
}

function setUploadedImage(form) {
	$('#image-selector-desktop-' + form).on('change', function(e) {
		var src = e.originalEvent.srcElement.files[0];

		var reader = new FileReader();
		reader.onloadend = function() {
			html({ banner: { desktop: reader.result } });
		};

		reader.readAsDataURL(src);
	});

	var content_images_inp = [];
	$('.image-selector-content').on('change', function(e) {
		var src = e.originalEvent.srcElement.files[0];

		var reader = new FileReader();
		reader.onloadend = function() {
			content_images_inp.push(reader.result);
			html({ content_images: content_images_inp });
		};

		reader.readAsDataURL(src);
	});
}

function setupGeneral() {
	$('#section_type_select').on('change', function() {
		var option = $(this).find('option:selected');
		var value = option.val();
		$('.forms-tgl').fadeOut();

		switch (value) {
			case '1':
				current_form = $('#foryou-form');
				setUploadedImage('foryou');
				html = compileHTML('For You');
				break;
			case '2':
				current_form = $('#promo-form');
				setupPromoForm();
				break;
			case '3':
				current_form = $('#insight-form');
				setUploadedImage('insight');
				html = compileHTML('Insight');
				break;
			case '4':
				current_form = $('#featured-form');
				html = compileHTML('Featured');
				break;
			case '5':
				current_form = $('#event-form');
				html = compileHTML('Event');
				break;
		}
		html(clearHTML);
		current_form.fadeIn();
	});
}

function processButton(type, component) {
	switch (type) {
		case '1':
			var button_text = component
				.parent()
				.find('.btn-input-text')
				.val();
			return `
				<div class="pl-20 pr-20 clearfix text-center">
					<button class="btn btn-action btn-medium mt-5 ml-10 mb-15">${button_text}</button>
				</div>
			`;
		case '2':
			var button_text = component
				.parent()
				.find('.btn-input-text')
				.val();
			return `
				<div class="pl-20 pr-20 clearfix text-center">
					<button class="btn btn-second btn-medium mt-5 ml-10 mb-15">${button_text}</button>
				</div>
			`;
		case '3':
			var button_text = [
				component
					.parent()
					.find('.btn-input-text')
					.eq(0)
					.val(),
				component
					.parent()
					.find('.btn-input-text')
					.eq(1)
					.val(),
			];
			return `
				<div class="pl-20 pr-20 clearfix text-center">
					<button class="btn btn-action btn-medium mt-5 mb-15">${button_text[0]}</button>
					<button class="btn btn-second btn-medium mt-5 ml-10 mb-15">${button_text[1]}</button>
				</div>
			`;
		case '4':
			var button_text = [
				component
					.parent()
					.find('.btn-input-text')
					.eq(0)
					.val(),
				component
					.parent()
					.find('.btn-input-text')
					.eq(1)
					.val(),
				component
					.parent()
					.find('.btn-input-text')
					.eq(2)
					.val(),
			];
			return `
				<div class="row-fluid btn-list-wrapper">
                    <button class="btn btn-second">${button_text[0]}</button>
                    <button class="btn btn-second">${button_text[1]}</button>
                    <button class="btn btn-second">${button_text[2]}</button>
				</div>
			`;
		default:
			return '';
	}
}

function setupPreview() {
	setupIframe();
	var iframe = $('#preview-mce');
	var iframe_content = iframe.contents().find('#content-iframe');
	$('#preview').on('click', function(e) {
		e.preventDefault();
		var buttons_type = current_form
			.find('.buttons-radio input:radio:checked')
			.val();

		var current_button = current_form
			.find('.buttons-radio input:radio')
			.eq(buttons_type - 1);

		var buttons = processButton(buttons_type, current_button);
		setIframeContent(iframe_content, html({ buttons }));
	});
}

function setupPromoForm() {
	setUploadedImage('promo');
	html = compileHTML('Promo');

	var iframe = $('#preview-mce');
	var iframe_content = iframe.contents().find('#content-iframe');

	var promo_code_component = iframe_content.find('.promo-code-wrapper');
	$('#promo-code-inp').on('keyup', function(e) {
		var promo_code = $(this).val();
		if (promo_code.length) {
			var render = html({ promo_code });
			iframe_content.html(render);
		}
	});

	$('#title-inp').on('change', function(e) {
		var title = $(this).val();
		var render = html({ title });
		iframe_content.html(render);
	});
}

function setIframeContent(component, html) {
	var date_format = {
		day: 'numeric',
		month: 'short',
	};

	var today = new Date();
	today = today.toLocaleDateString('id-ID', date_format);
	component.html(html.replace('%date_time%', today));
}
