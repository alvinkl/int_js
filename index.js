(function() {
	var html_editing = {
		banner: {},
		title: '',
		content: '',
		content_images: [],
		promo_code: '',
		buttons: '',
		footnote: '',
	};

	var html;

	var initial_state = {
		/* General form */
		section: 0,
		thumbnailImageURL: '',
		title: '',
		shortDescription: '',
		startDate: 0,
		endDate: 0,

		/* Content form */
		bannerImageDesktopURL: '',
		content: '',
		contentImagesURL: [],
		footnote: '',
		button_type: 0,
		promoCode: '',
	};

	var currentState = new State(initial_state);

	var $current_form = $('#form-input');

	$(document).ready(function() {
		setupGeneralForm();
		setupFormContent();
	});

	function setupGeneralForm() {
		var $current_form = $('#form-spec-1');

		var current_page = 1;
		var remove_tmce = setInterval(function() {
			$tmc = $(
				'.mce-statusbar.mce-container.mce-panel.mce-stack-layout-item.mce-last',
			);
			if ($tmc.length) {
				$(
					'.mce-statusbar.mce-container.mce-panel.mce-stack-layout-item.mce-last',
				).hide();
				clearInterval(remove_tmce);
			}
		});

		/* Setup next back clear button */
		$('.clear-form').on('click', function() {
			var $form = $(this).parents('.form-spec');
			var $form2 = $('#form-spec-2');

			var $form_inputs = $form.find('input, textarea');
			var $option = $form.find('#section_type_select').find('option');
			var $radio = $form.find('input[type=radio]');
			var $promo_input = $('.promo-code-form-inp');
			var $content_mce = tinymce.get('mce');
			var $footnote_mce = tinymce.get('ftn');
			var $form2_inputs = $form2.find('input');

			$form_inputs.val('');
			$form2_inputs.val('');

			$option.attr('selected', false);
			$radio.prop('checked', function() {
				return this.getAttribute('checked') == 'checked';
			});

			$promo_input
				.off()
				.hide()
				.val('');

			$content_mce.setContent('');
			$footnote_mce.setContent('');

			html_editing = clearHTML;
			currentState.setState(initialState);
		});

		$('.continue-page').on('click', function() {
			var $form = $(this).parents('.form-spec');
			var nextForm = $('#form-spec-' + ++current_page);

			$form.fadeOut(500, function() {
				nextForm.fadeIn();
			});
		});

		$('.back-page').on('click', function() {
			var $form = $(this).parents('.form-spec');
			var $prevForm = $('#form-spec-' + --current_page);

			$form.fadeOut(500, function() {
				$prevForm.fadeIn();
			});
		});
		/* End of Setup next previous clear button */

		/* BEGIN event listeners for input */
		var $input_text = $current_form.find('input[type=text], textarea');
		var $input_date = $current_form.find('input[type=datetime-local]');
		var $image_thumbnail = $current_form.find('#pickfiles');

		$input_text.off().on('change keyup', function(e) {
			var text = e.target.value,
				type = e.target.id;

			currentState.setState({ [type]: text });
			html_editing[type] = text;
		});

		$input_date.off().on('change keyup', function(e) {
			var text = e.target.value,
				type = e.target.id,
				unix = Date.parse(text) / 1000;

			currentState.setState({ [type]: unix });
		});

		var params = {
			token: '1020eb1432094d7257b23e79f695f745',
			user_id: 1163,
			server_id: 49,
			id: 1163,
		};

		/* thumbnail uploader */
		var $upload_thumbnail = $('#upload-thumbnail');
		var $remove_thumbnail = $('#remove-thumbnail');
		var $preview_thumbnail = $('#preview-thumbnail');

		var uploader = new plupload.Uploader({
			runtimes: 'html5,flash,silverlight,html4',

			browse_button: 'image-selector-thumbnail', // you can pass in id...

			url: 'http://go.ak-alvin.ndvl:777/upload/attachment',

			flash_swf_url: '../js/Moxie.swf',
			silverlight_xap_url: '../js/Moxie.xap',

			multipart_params: params,
			file_data_name: 'fileToUpload',

			filters: {
				max_file_size: '10mb',
				mime_types: [{ title: 'Image files', extensions: 'jpg,gif,png' }],
			},

			init: {
				PostInit: function() {
					$upload_thumbnail.on('click', function() {
						uploader.start();
					});

					$remove_thumbnail.on('click', function() {
						$(this).hide();
						uploader.files.pop();
						$preview_thumbnail.html('');
					});
				},

				FilesAdded: function(up, files) {
					$remove_thumbnail.show();
					$upload_thumbnail.show();

					var file = files[0];
					var thumbnail_loader = new moxie.image.Image();

					thumbnail_loader.onerror = function(e) {
						console.log(e);
					};

					thumbnail_loader.onload = () => {
						var src = thumbnail_loader.getAsDataURL();
						convertURIToImageData(src).then(function(blob) {
							window.URL = window.URL || window.webkitURL;
							var blobURL = window.URL.createObjectURL(blob);

							$preview_thumbnail.html(
								`<div class="loading-bar" style="height: 20px; background: white; position: absolute;"></div><img src="${
									blobURL
								}" />`,
							);

							currentState.setState({ thumbnailImageURL: blobURL });
						});
					};

					thumbnail_loader.load(file.getSource());
				},

				UploadProgress: function(up, file) {
					var $preview_loading_bar = $preview_thumbnail.find('.loading-bar');

					$preview_loading_bar.text(file.percent + '%');

					$preview_loading_bar.css({ width: `${file.percent}%` });
				},

				FileUploaded: function(uploader, file, info) {
					$upload_thumbnail.hide();
					var info = JSON.parse(info.response);

					currentState.setState({ thumbnailImageURL: info.pic_src });
				},

				Error: function(up, err) {
					console.log('Error #' + err.code + ': ' + err.message);
				},
			},
		});

		uploader.init();

		/* END of event listeners for inputs */

		$('#section_type_select').on('change', function() {
			var $option = $(this).find('option:selected');
			var value = $option.val();

			currentState.setState({ section: value });
			setupContent(value);
		});
	}

	function convertURIToImageData(URI) {
		return new Promise(function(resolve, reject) {
			if (URI == null) return reject();
			var canvas = document.createElement('canvas'),
				context = canvas.getContext('2d'),
				image = new Image();
			image.addEventListener(
				'load',
				function() {
					canvas.width = image.width;
					canvas.height = image.height;
					context.drawImage(image, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(
						function(blob) {
							resolve(blob);
						},
						'image/jpeg',
						1,
					);
				},
				false,
			);
			image.src = URI;
		});
	}

	function setupContent(type = 0) {
		switch (type) {
			case '1':
				setUploadedImage('foryou');
				html = compileHTML('For You');
				break;
			case '2':
				setUploadedImage('promo');
				html = compileHTML('Promo');
				break;
			case '3':
				setUploadedImage('insight');
				html = compileHTML('Insight');
				break;
			case '4':
				html = compileHTML('Featured');
				break;
			case '5':
				html = compileHTML('Event');
				break;
			default:
				html(clearHTML);
		}
	}

	function setupFormContent() {
		setupPreview();
		setupTinyMCE();
		setupImageUploaderContent();

		/* BEGIN event listeners for input */
		var $current_form = $('#form-spec-2');
		var $promo_input = $current_form.find('#promo-code-inp');
		var $button_selection = $current_form.find('.buttons-radio');

		var $submit = $current_form.find('#submit');

		$promo_input.off().on('keyup', function(e) {
			var promo_code = $(this).val();
			if (promo_code.length) {
				currentState.setState({ promoCode: promo_code });
				html_editing = Object.assign({}, html_editing, {
					promo_code,
				});
			}
		});

		$button_selection.on('change', function(e) {
			var button_type =
				parseInt(e.target.value) || currentState.getState().button_type;

			currentState.setState({ button_type });
		});

		$submit.off().on('click', function(e) {
			e.preventDefault();
			submitUploadImage($('#image-selector-desktop'));
		});
		/* BEGIN event listeners for input */
	}

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

		function tinyMceSetup($editor) {
			var $iframe = $('#preview-mce');
			var $iframe_content = $iframe.contents().find('#content-iframe');

			$editor.on('keyup', function() {
				var content = tinymce.activeEditor.getContent();

				currentState.setState({ content });
				html_editing = Object.assign({}, html_editing, { content });
			});
			$editor.on('change', function() {
				var content = tinymce.activeEditor.getContent();

				currentState.setState({ content });
				html_editing = Object.assign({}, html_editing, { content });
			});
		}

		function tinyMceFootnoteSetup($editor) {
			var $iframe = $('#preview-mce');
			var $iframe_content = $iframe.contents().find('#content-iframe');

			$editor.on('keyup', function() {
				var footnote = tinymce.activeEditor.getContent();

				currentState.setState({ footnote });
				html_editing = Object.assign({}, html_editing, { footnote });
			});
			$editor.on('change', function() {
				var footnote = tinymce.activeEditor.getContent();

				currentState.setState({ footnote });
				html_editing = Object.assign({}, html_editing, { footnote });
			});
		}

		tinymce.init(Object.assign({}, tinymce_view, tinymce_settings));
		tinymce.init(Object.assign({}, tinymce_view, tinymce_settings_2));
	}

	function setupIframe() {
		var $iframe = $('#preview-mce');
		var $iframe_content = $iframe.contents();
		var addCSS = function(href) {
			$iframe_content.find('head').append(
				$('<link />', {
					rel: 'stylesheet',
					href,
					type: 'text/css',
				}),
			);
		};

		addCSS('./preview.css');
		addCSS('http://ak-alvin.ndvl/css/dv3-bootstrap-short.css');
		addCSS('http://ak-alvin.ndvl/css/dv3-global-short.css');
		addCSS('http://ak-alvin.ndvl/css/dv3-new-button.css');

		$iframe_content.find('body').html(`
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
			banner: {},
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
				url: '',
			},
			title: '',
			content: '',
			content_images: [
				{
					url: '',
				},
			],
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
					$('.copy').on('click', function(e) {
						e.preventDefault();
						$(this).html('<i style="color: green">&#10003;</i> Tersalin');
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

			if (html.banner.url) {
				header = `
					<content-header hidden>${JSON.stringify(html.banner.url)}</content-header>
					<div class="info-top-banner info-top-banner--video relative" style="background-image: url(${
						html.banner.url
					});">
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
					.map(img => `<img src="${img.url}"/>`)
					.join('');
			}

			var border_content = html.banner.url ? 'no-border-top' : 'border-top';
			var contents = `
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
						<content-images hidden>${JSON.stringify(html.content_images)}</content-images>
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

		$('#image-selector-desktop').on('change', function(e) {
			var src = e.originalEvent.srcElement.files[0];
			processImageToData(src);
			show_rem_btn();
		});
	}

	function processImageToData(file, type = 0) {
		if (!/image/i.test(file.type)) {
			alert('File ' + file.name + ' is not an image.');
			return false;
		}

		var reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = function(event) {
			var blob = new Blob([event.target.result]);
			window.URL = window.URL || window.webkitURL;
			var blobURL = window.URL.createObjectURL(blob);

			if (type == 0) {
				currentState.setState({ bannerImageDesktopURL: blobURL });
				html_editing = Object.assign({}, html_editing, {
					banner: { url: blobURL },
				});
			} else {
				var { content_images } = html_editing;
				content_images.push({
					url: blobURL,
				});

				currentState.setState({ contentImagesURL: content_images });

				html_editing = Object.assign({}, html_editing, {
					content_images,
				});
			}
		};
	}

	function processButton(type, data) {
		var $component = undefined;
		if (!data) $component = $('.buttons-radio input:radio').eq(type - 1);

		switch (type) {
			case 1:
				var button_text = $component
					? $component
							.parent()
							.find('.btn-input-text')
							.val()
					: data.text[0];

				var button_link = $component
					? $component
							.parent()
							.find('.btn-input-link')
							.val()
					: data.link[0];

				var content_btn = {
					type,
					text: [button_text],
					link: [button_link],
				};

				return `
				<div class="pl-20 pr-20 clearfix text-center">
					<content-button hidden>${JSON.stringify(content_btn)}</content-button>
					<a href="${button_link}" class="btn btn-action btn-medium mt-5 ml-10 mb-15">${
					button_text
				}</a>
				</div>
			`;
			case 2:
				var button_text = $component
					? $component
							.parent()
							.find('.btn-input-text')
							.val()
					: data.text[0];

				var button_link = $component
					? $component
							.parent()
							.find('.btn-input-link')
							.val()
					: data.link[0];

				var content_btn = {
					type,
					text: [button_text],
					link: [button_link],
				};

				return `
				<div class="pl-20 pr-20 clearfix text-center">
					<content-button hidden>${JSON.stringify(content_btn)}</content-button>
					<a href="${button_link}" class="btn btn-second btn-medium mt-5 ml-10 mb-15">${
					button_text
				}</a>
				</div>
			`;
			case 3:
				var button_text = $component
					? [
							$component
								.parent()
								.find('.btn-input-text')
								.eq(0)
								.val(),
							$component
								.parent()
								.find('.btn-input-text')
								.eq(1)
								.val(),
						]
					: data.text;

				var button_link = $component
					? [
							$component
								.parent()
								.find('.btn-input-link')
								.eq(0)
								.val(),
							$component
								.parent()
								.find('.btn-input-link')
								.eq(1)
								.val(),
						]
					: data.link;

				var content_btn = {
					type,
					text: [...button_text],
					link: [...button_link],
				};
				return `
				<div class="pl-20 pr-20 clearfix text-center">
					<content-button hidden>${JSON.stringify(content_btn)}</content-button>
					<a href="${button_link[0]}" class="btn btn-action btn-medium mt-5 mb-15">${
					button_text[0]
				}</a>
					<a href="${
						button_link[1]
					}" class="btn btn-second btn-medium mt-5 ml-10 mb-15">${
					button_text[1]
				}</a>
				</div>
			`;
			case 4:
				var button_text = $component
					? [
							$component
								.parent()
								.find('.btn-input-text')
								.eq(0)
								.val(),
							$component
								.parent()
								.find('.btn-input-text')
								.eq(1)
								.val(),
							$component
								.parent()
								.find('.btn-input-text')
								.eq(2)
								.val(),
						]
					: data.text;

				var button_link = $component
					? [
							$component
								.parent()
								.find('.btn-input-link')
								.eq(0)
								.val(),
							$component
								.parent()
								.find('.btn-input-link')
								.eq(1)
								.val(),
							$component
								.parent()
								.find('.btn-input-link')
								.eq(2)
								.val(),
						]
					: data.link;

				var content_btn = {
					type,
					text: [...button_text],
					link: [...button_link],
				};

				return `
				<div class="row-fluid btn-list-wrapper">
					<content-button hidden>${JSON.stringify(content_btn)}</content-button>
                    <a href="${button_link[0]}" class="btn btn-second">${
					button_text[0]
				}</a>
                    <a href="${button_link[1]}" class="btn btn-second">${
					button_text[1]
				}</a>
                    <a href="${button_link[2]}" class="btn btn-second">${
					button_text[2]
				}</a>
				</div>
			`;
			default:
				return '';
		}
	}

	function setupPreview() {
		setupIframe();
		var $iframe = $('#preview-mce');
		var $iframe_content = $iframe.contents().find('#content-iframe');
		$('#preview').on('click', function(e) {
			e.preventDefault();
			var state = currentState.getState();

			var buttons = processButton(state.button_type);
			html_editing = Object.assign({}, html_editing, { buttons });

			setIframeContent($iframe_content, html(html_editing));
		});
	}

	function setIframeContent($component, html) {
		var date_format = {
			day: 'numeric',
			month: 'short',
		};

		var state = currentState.getState();
		var unix = state.startDate * 1000;

		var date = new Date(unix);
		date = date.toLocaleDateString('id-ID', date_format);

		console.log(processEditContent(html));

		$component.html(html.replace('%date_time%', date));
	}

	function processEditContent(html) {
		var header_reg = new RegExp(
				'<content-header hidden>(.+)</content-header>',
				'i',
			),
			header_content = header_reg.exec(html),
			header_content = header_content ? JSON.parse(header_content[1]) : {};

		var title_reg = new RegExp(
				'<content-title hidden>(.+)</content-title>',
				'i',
			),
			title_content = title_reg.exec(html),
			title_content = title_content ? title_content[1] : '';

		var text_reg = new RegExp('<content-text hidden>(.+)</content-text>', 'i'),
			text_content = text_reg.exec(html),
			text_content = text_content ? text_content[1] : '';

		var promo_reg = new RegExp(
				'<content-promo hidden>(.+)</content-promo>',
				'i',
			),
			promo_content = promo_reg.exec(html),
			promo_content = promo_content ? promo_content[1] : '';

		var images_reg = new RegExp(
				'<content-images hidden>(.+)</content-images>',
				'i',
			),
			images_content = images_reg.exec(html),
			images_content = images_content ? JSON.parse(images_content[1]) : {};

		var footnote_reg = new RegExp(
				'<content-footnote hidden>(.+)</content-footnote>',
				'i',
			),
			footnote_content = footnote_reg.exec(html),
			footnote_content = footnote_content ? footnote_content[1] : '';

		var buttons_reg = new RegExp(
				'<content-button hidden>(.+)</content-button>',
				'i',
			),
			button_content = buttons_reg.exec(html),
			button_content = button_content ? JSON.parse(button_content[1]) : {};

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

	function setupImageUploaderContent() {
		// Change this to the location of your server-side upload handler:
		var url =
				window.location.hostname === 'blueimp.github.io'
					? '//jquery-file-upload.appspot.com/'
					: 'server/php/',
			uploadButton = $('<button/>')
				.addClass('btn btn-primary')
				.prop('disabled', true)
				.text('Processing...')
				.on('click', function() {
					var $this = $(this),
						data = $this.data();
					$this
						.off('click')
						.text('Abort')
						.on('click', function() {
							$this.remove();
							data.abort();
						});
					data.submit().always(function() {
						$this.remove();
					});
				});
		$('#fileupload')
			.fileupload({
				url: url,
				dataType: 'json',
				autoUpload: false,
				acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
				maxFileSize: 99999000,
				// Enable image resizing, except for Android and Opera,
				// which actually support image resizing, but fail to
				// send Blob objects via XHR requests:
				disableImageResize: /Android(?!.*Chrome)|Opera/.test(
					window.navigator.userAgent,
				),
				previewMaxWidth: 500,
				previewMaxHeight: 300,
				previewCrop: false,
			})
			.on('fileuploadadd', function(e, data) {
				processImageToData(data.originalFiles[0], 1);
				data.context = $('<div/>').appendTo('#files');
				$.each(data.files, function(index, file) {
					var node = $('<p/>').append($('<span/>').text(file.name));
					if (!index) {
						node.append('<br>').append(uploadButton.clone(true).data(data));
					}
					node.appendTo(data.context);
				});
			})
			.on('fileuploadprocessalways', function(e, data) {
				var index = data.index,
					file = data.files[index],
					node = $(data.context.children()[index]);
				if (file.preview) {
					node.prepend('<br>').prepend(file.preview);
				}
				if (file.error) {
					node
						.append('<br>')
						.append($('<span class="text-danger"/>').text(file.error));
				}
				if (index + 1 === data.files.length) {
					data.context
						.find('button')
						.text('Upload')
						.prop('disabled', !!data.files.error);
				}
			})
			.on('fileuploadprogressall', function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css('width', progress + '%');
			})
			.on('fileuploaddone', function(e, data) {
				$.each(data.result.files, function(index, file) {
					if (file.url) {
						var link = $('<a>')
							.attr('target', '_blank')
							.prop('href', file.url);
						$(data.context.children()[index]).wrap(link);
					} else if (file.error) {
						var error = $('<span class="text-danger"/>').text(file.error);
						$(data.context.children()[index])
							.append('<br>')
							.append(error);
					}
				});
			})
			.on('fileuploadfail', function(e, data) {
				$.each(data.files, function(index) {
					var error = $('<span class="text-danger"/>').text(
						'File upload failed.',
					);
					$(data.context.children()[index])
						.append('<br>')
						.append(error);
				});
			})
			.prop('disabled', !$.support.fileInput)
			.parent()
			.addClass($.support.fileInput ? undefined : 'disabled');
	}

	function submitUploadImage(src) {
		/* show progress bar */
		$('#progress').show();

		var img = src.prop('files')[0];

		var dataUpload = new FormData();
		dataUpload.append('name', img.name);
		dataUpload.append('user_id', 32464);
		dataUpload.append('origin', 'sellerinfo');
		dataUpload.append('fileToUpload', img);

		/*
			URL       = "https://up-staging.tokopedia.net/upload/attachment"
			ImageCDN  = "https://ecs7.tokopedia.net/img/"
		*/
		$.ajax({
			url: 'https://up-staging.tokopedia.net/upload/attachment',
			// type: 'OPTIONS',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Access-Control-Allow-Origin': 'https://up-staging.tokopedia.net',
			},
			beforeSend: function(request) {
				request.setRequestHeader(
					'Access-Control-Request-Headers',
					'content-disposition',
				);
			},
		}).then(
			$.ajax({
				url: 'https://up-staging.tokopedia.net/upload/attachment',
				global: false,
				type: 'POST',
				data: dataUpload,
				contentType: false,
				processData: false,
				cache: false,
				success: function(result) {
					console.log(result);
				},
			}),
		);
	}
	/* Start of Object State to manage state of the page*/
	function State(state) {
		this.state = state;
	}

	State.prototype.setState = function(newState, cb) {
		this.state = Object.assign({}, this.state, newState);
		console.log('=== state update ===');
		console.log(this.state);

		if (cb) cb(this.state);
	};

	State.prototype.getState = function() {
		return this.state;
	};

	/* End of Object State to manage state of the page*/
})();
