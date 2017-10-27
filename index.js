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
		content_security_policy:
			"default-src 'self'; style-src 'self' 'unsafe-inline'",

		content_css: [
			'./preview.css',
			'http://ak-alvin.ndvl/css/dv3-bootstrap-short.css',
		],
		setup: tinyMceSetup,
	},
	promo_template = `
        <div id='content_template'>
            <div class="info-top-banner info-top-banner--img relative">
                <img src="https://ecs7.tokopedia.net/img/product-1/2016/6/1/2213586/2213586_a782e33e-e450-48ca-8908-3843c16c156f.jpg"/>
            </div>
            <div class="border-wrapper no-border-top">
                <div class="relative pt-20">
                    <div class="pl-20 pr-20">
                        <span class="fs-12">Promo&nbsp;&sdot;</span>
                        <span class="fs-10 muted">20 Jun</span>
                    </div>
                    <h3 class="info-title">Nikmati Beli Ini Itu, Dapatkan Gratis Ongkir ke Seluruh Indonesia</h3>
                    <div class="content-text">
                        <p>Tak perlu lagi antri di stasiun atau takut kehabisan, kini kamu bisa membeli tiket kereta di Tokopedia.
                        Jadi makin seru karena kamu bakal dapat cashback sebesar Rp 10.000 ke TokoCash, untuk setiap pembelian tiket minimal Rp 100.000 menggunakan TokoCash.
                        <br/><br/>Promo ini berlaku untuk pembelian tiket kereta ke mana aja, termasuk ke destinasi favoritmu.
                        Jangan sampai ketinggalan, promo ini cuma berlaku 9-31 Agustus 2017!</p>
                    </div>
                </div>
                <div class="promo-code-wrapper">
                    <h4 class="main-title">Kode Promo</h4>
                    <div>
                        <div class="promo-code-copy">
                            <span class="text">kodekodekode</span>
                            <a class="copy" href="#">Salin Kode</a>
                        </div>
                    </div>
                    <button class="btn btn-action btn-medium">Ajukan Sekarang</button>
                    <div>
                        <a class="inline-block mt-10 mb-10" href="#">Lihat Promo Lainnya</a>
                    </div>
                </div>
            </div>
        </div>
    `,
	event_template = `
        <div id='content_template'>
            <div class="info-top-banner info-top-banner--img relative">
                <img src="https://ecs7.tokopedia.net/img/product-1/2016/6/1/2213586/2213586_a782e33e-e450-48ca-8908-3843c16c156f.jpg"/>
            </div>
            <div class="border-wrapper no-border-top">
                <div class="relative pt-20">
                    <div class="pl-20 pr-20">
                        <span class="fs-12">Event&nbsp;&sdot;</span>
                        <span class="fs-10 muted">20 Jun</span>
                    </div>
                    <h3 class="info-title">Tokopedia Gelar Temu Toppers Khusus Seller Gold Merchant</h3>
                    <div class="content-text">
                        <p>Pada Senin (23/1/17), Tokopedia kembali menyelenggarakan Temu Toppers. Acara kali ini khusus untuk para seller Gold Merchant dan membahas  pentingnya penggunaan fitur-fitur Gold Merchant, yakni TopAds dan Shop Statistic.<br/><br/>Melalui penggunaan TopAds, keberadaan toko akan diiklankan pada waktu-waktu tertentu dengan budget sesuai pilihan seller. Seller juga bisa memantau potensi serta hasil penjualan melalui Shop Statistic. Poin-poin tersebutlah yang ditekankan pada peserta, sehingga mereka dapat memaksimalkan keunggulan tokonya.<br/><br/>Acara semakin hangat saat salah satu top seller dari Top Community membagikan kunci sukses berbisnis online pada sesi kedua. Banyak peserta mengajukan pertanyaan tips-tips yang nantinya dapat diterapkan pada toko mereka masing-masing.</p>
                    </div>
                </div>
                <div class="row-fluid btn-list-wrapper">
                    <button class="btn btn-second">Lihat Event Seller</button>
                    <button class="btn btn-second">Kalender Event</button>
                    <button class="btn btn-second">Ajukan Event</button>
                </div>
            </div>
        </div>
    `,
	insight_template = `
        <div id='content-template'>
            <div class="border-wrapper">
                <div class="relative pt-20">
                    <div class="pl-20 pr-20">
                        <span class="fs-12">Insight&nbsp;&sdot;</span>
                        <span class="fs-10 muted">20 Jun</span>
                    </div>
                    <h3 class="info-title">4 Hal yang Harus Anda Ketahui Tentang TopAds!</h3>
                    <div class="content-text">
                        <p>Hai Toppers !<br/>Saat menggunakan fitur TopAds, pastinya Anda akan menemukan istilah baru yang membuat Anda bertanya – tanya. Tentunya hal tersebut penting untuk dipahami karena Anda akan sering menemukannya pada halaman pengaturan TopAds. Yuk, kita kenali istilah – istilah tersebut lewat penjelasan di bawah ini.</p>
                    </div>
                </div>
                <div style="padding: 0 20px;margin-bottom:10px">
                    <img src="img/about-topads.png"/>
                </div>
                <div class="pl-20 pr-20 clearfix text-center">
                    <div class="fs-13 mb-10">Tunggu apalagi? Ayo maksimalkan penggunaan <a href="#">TopAds</a> di toko Anda, dan rasakan keuntungannya!</div>
                    <button class="btn btn-action btn-medium mt-5 mb-15">Tambah Kredit TopAds</button>
                    <button class="btn btn-second btn-medium mt-5 ml-10 mb-15">Coba Sekarang</button>
                </div>
            </div>
        </div>
    `;

var template = {
	promo: promo_template,
	event: event_template,
	insight: insight_template,
};

var promo_code_template = `
    <div class="promo-code-wrapper">
        <h4 class="main-title">Kode Promo</h4>
        <div>
            <div class="promo-code-copy">
                <span class="text">kodekodekode</span>
                <a class="copy" href="#">Salin Kode</a>
            </div>
        </div>
        <button class="btn btn-action btn-medium mb-15">Cek Sekarang</button>
    </div>
`;

var button_template = {
	action:
		'<button class="btn btn-action btn-medium mt-5 mb-15">Tambah Kredit TopAds</button>',
	second:
		'<button class="btn btn-second btn-medium mt-5 ml-10 mb-15">Coba Sekarang</button>',
	promo: promo_code_template,
};

$(document).ready(function() {
	setupIframe();

	$('#preview').on('click', function() {
		tinymce.get('mce').execCommand('mcePreview');
	});

	$('#add-more-image').on('click', function() {
		var upload_btn = `<label for="image-selector-content" class="btn btn-primary">
                            <input type="file" class="image-selector-content" style="display:none" /> Upload
                        </label>`;
		$('.images-row').append(upload_btn);
	});

	tinymce.init(Object.assign({}, tinymce_view, tinymce_settings));
});

function tinyMceSetup(editor) {
	editor.on('keyup', function() {
		console.log(tinymce.activeEditor.getContent());
		$('#preview-mce')
			.contents()
			.find('#content-iframe')
			.html(tinymce.activeEditor.getContent());
	});
	editor.on('change', function() {
		console.log(tinymce.activeEditor.getContent());
		$('#preview-mce')
			.contents()
			.find('#content-iframe')
			.html(tinymce.activeEditor.getContent());
	});

	editor.addButton('title', {
		text: 'Title',
		icon: false,
		onClick: function() {
			editor.insertContent('<h3 class="info-title">{title}</h3>');
		},
	});

	$('.template-component').on('click', function(e) {
		e.preventDefault();
		var type = $(this).attr('name');
		editor.setContent(template[type]);
	});

	$('.button-component').on('click', function(e) {
		e.preventDefault();
		var type = $(this).attr('name');
		editor.insertContent(button_template[type]);
	});
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
			}),
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
