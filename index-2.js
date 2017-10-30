var html_editing = {};
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
			toolbar: [
				'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link',
			],

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
	var tinymce_settings_2 = {
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
			html_editing = Object.assign({}, html_editing, { content });
		});
		editor.on('change', function() {
			var content = tinymce.activeEditor.getContent();
			html_editing = Object.assign({}, html_editing, { content });
		});
	}

	function tinyMceFootnoteSetup(editor) {
		var iframe = $('#preview-mce');
		var iframe_content = iframe.contents().find('#content-iframe');

		editor.on('keyup', function() {
			var footnote = tinymce.activeEditor.getContent();
			html_editing = Object.assign({}, html_editing, { footnote });
		});
		editor.on('change', function() {
			var footnote = tinymce.activeEditor.getContent();
			html_editing = Object.assign({}, html_editing, { footnote });
		});
	}

	tinymce.init(Object.assign({}, tinymce_view, tinymce_settings));
	tinymce.init(Object.assign({}, tinymce_view, tinymce_settings_2));
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
							<content-promo hidden>${promo_code}</content-promo>
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
			<content-header hidden>${JSON.stringify(html.banner)}</content-header>
			${header}
			<content>
				<div class="border-wrapper ${border_content}">
					<div class="relative pt-20">
						<div class="pl-20 pr-20">
							<span class="fs-12">${type}&nbsp;&sdot;</span>
							<span class="fs-10 muted">%date_time%</span>
						</div>
						<content-title hidden>${html.title}</content-title>
						<h3 class="info-title">${html.title}</h3>
						<div class="content-text">
							<content-text hidden>${html.content}</content-text>
							${html.content}
							${render_promo_code}
						</div>
					</div>
					<div style="padding: 0 20px;margin-bottom:10px">
						<content-images hidden>${JSON.stringify(
							html.content_images
						)}</content-images>
						${render_content_images}
					</div>
					<div class="pl-20 pr-20 clearfix text-center">
							<div class="fs-13 mb-10">
								<content-footnote hidden>${html.footnote}</content-footnote>
								${html.footnote}
							</div>
					</div>
					${html.buttons}
				</div>
			</content>
		`;

		processEditContent(contents);
		return contents;
	};
}

function setUploadedImage(form) {
	var show_rem_btn = function() {
		$('.remove-banner-image')
			.off()
			.on('click', function() {
				$(this)
					.parent()
					.find('input')
					.val('');
				html_editing = Object.assign({}, html_editing, {
					banner: { desktop: '' },
				});
				$(this).hide();
			})
			.show();
	};

	$('#image-selector-desktop-' + form).on('change', function(e) {
		var src = e.originalEvent.srcElement.files[0];

		var reader = new FileReader();
		reader.onloadend = function() {
			html_editing = Object.assign({}, html_editing, {
				banner: { desktop: reader.result },
			});
		};

		reader.readAsDataURL(src);

		show_rem_btn();
	});

	var content_images_inp = [];
	$('.image-selector-content').on('change', function(e) {
		var src = e.originalEvent.srcElement.files[0];

		var reader = new FileReader();
		reader.onloadend = function() {
			content_images_inp.push(reader.result);
			html_editing = Object.assign({}, html_editing, {
				content_images: content_images_inp,
			});
		};

		reader.readAsDataURL(src);

		show_rem_btn();
	});
}

function setupGeneral() {
	var remove_tmce = setInterval(function() {
		tmc = $(
			'.mce-statusbar.mce-container.mce-panel.mce-stack-layout-item.mce-last'
		);
		if (tmc.length) {
			$(
				'.mce-statusbar.mce-container.mce-panel.mce-stack-layout-item.mce-last'
			).hide();
			clearInterval(remove_tmce);
		}
	});

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
			default:
				current_form.fadeOut();
				html(clearHTML);
				return;
		}
		html_editing = clearHTML;
		current_form.fadeIn();

		current_form
			.find('.title-inp')
			.off()
			.on('keyup', function(e) {
				var title = $(this).val();
				html_editing = Object.assign({}, html_editing, { title });
			});
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
					<content-button hidden>{ "type": ${type}, "text": ["${button_text}"] }</content-button>
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
					<content-button hidden>{ "type": ${type}, "text": ["${button_text}"] }</content-button>
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
					<content-button hidden>{ "type": ${type}, "text": ${JSON.stringify(
				button_text
			)} }</content-button>
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
					<content-button hidden>{ "type": ${type}, "text": ${JSON.stringify(
				button_text
			)} }</content-button>
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
		html_editing = Object.assign({}, html_editing, { buttons });
		setIframeContent(iframe_content, html(html_editing));
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
			html_editing = Object.assign({}, html_editing, { promo_code });
		}
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

function processEditContent(html) {
	var header_reg = new RegExp(
			'<content-header hidden>(.+)</content-header>',
			'i'
		),
		header_content = header_reg.exec(html),
		header_content = header_content ? header_content[1] : '';

	var title_reg = new RegExp(
			'<content-title hidden>(.+)</content-title>',
			'i'
		),
		title_content = title_reg.exec(html),
		title_content = title_content ? title_content[1] : '';

	var text_reg = new RegExp('<content-text hidden>(.+)</content-text>', 'i'),
		text_content = text_reg.exec(html),
		text_content = text_content ? text_content[1] : '';

	var promo_reg = new RegExp(
			'<content-promo hidden>(.+)</content-promo>',
			'i'
		),
		promo_content = promo_reg.exec(html),
		promo_content = promo_content ? promo_content[1] : '';

	var images_reg = new RegExp(
			'<content-images hidden>(.+)</content-images>',
			'i'
		),
		images_content = images_reg.exec(html),
		images_content = images_content ? images_content[1] : '';

	var footnote_reg = new RegExp(
			'<content-footnote hidden>(.+)</content-footnote>',
			'i'
		),
		footnote_content = footnote_reg.exec(html),
		footnote_content = footnote_content ? footnote_content[1] : '';

	var buttons_reg = new RegExp(
			'<content-button hidden>(.+)</content-button>',
			'i'
		),
		button_content = buttons_reg.exec(html),
		button_content = button_content ? button_content[1] : '';

	return {
		header: header_content,
		title: title_content,
		text: text_content,
		promo: promo_content,
		images: images_content,
		footnote: footnote_content,
		buttons: button_content,
	};
}
