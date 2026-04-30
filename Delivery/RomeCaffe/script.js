let menuData = null;
let state = {
	lang: 'en',
	filter: 'all',
	search: ''
};

const translations = {
	en: {
		welcome: 'Welcome to Niko Cafe',
		heroTitle: 'Crafted Drinks, Sweet Treats, and Feel-Good Energy',
		heroText: 'Explore our modern menu with hot and cold coffees, desserts, pancakes, smoothies, protein shakes, and more.',
		infoHours: 'Open Daily: 8:00 AM - 11:00 PM',
		infoFresh: 'Freshly Made',
		infoService: 'Pickup & Dine-In',
		browseMenu: 'Browse Menu',
		footerText: 'Made fresh daily at Niko Cafe',
		searchPlaceholder: 'Search item name...',
		languageLabel: 'Language'
	},
	ku: {
		welcome: 'بەخێربێن بۆ نیکۆ کافێ',
		heroTitle: 'خواردنەوەی تایبەت، شیرینی خۆش، و وزەی باش',
		heroText: 'مێنوی مۆدێرنمان ببینە کە قەوەی گەرم و سارد، دێسێرت، پانکێیک، سمووتی، پرۆتین شەیک و زیاتر تێدایە.',
		infoHours: 'هەموو ڕۆژێک: 8:00 بەیانی - 11:00 شەو',
		infoFresh: 'بە تازەیی ئامادە دەکرێت',
		infoService: 'بردنەوە و دانیشتن لە شوێن',
		browseMenu: 'بینینی مێنو',
		footerText: 'هەموو ڕۆژێک بە تازەیی ئامادە دەکرێت لە نیکۆ کافێ',
		searchPlaceholder: 'ناوی خواردن بگەڕێ...',
		languageLabel: 'زمان'
	},
	ar: {
		welcome: 'مرحبا بك في نيكو كافيه',
		heroTitle: 'مشروبات مصنوعة يدويا وحلويات لذيذة وطاقة إيجابية',
		heroText: 'اكتشف قائمتنا الحديثة مع القهوة الساخنة والباردة والحلويات والفطائر والعصائر والرجات البروتينية والمزيد.',
		infoHours: 'مفتوح يوميا: 8:00 صباحا - 11:00 مساء',
		infoFresh: 'طازج مصنوع',
		infoService: 'استلام وتناول الطعام',
		browseMenu: 'استعرض القائمة',
		footerText: 'مصنوع طازج يوميا في نيكو كافيه',
		searchPlaceholder: 'ابحث عن اسم الطعام...',
		languageLabel: 'اللغة'
	}
};

// Load menu data from JSON
async function loadMenuData() {
	try {
		const response = await fetch('menu-data.json');
		menuData = await response.json();
		initializeApp();
	} catch (error) {
		console.error('Error loading menu data:', error);
	}
}

function initializeApp() {
	const filterButtonsWrap = document.getElementById('filterButtons');
	const searchInput = document.getElementById('menuSearch');
	const menuGrid = document.getElementById('menuGrid');
	const languageSelect = document.getElementById('languageSelect');

	renderStaticText();
	renderFilters();
	renderMenu();

	searchInput.addEventListener('input', (event) => {
		state.search = event.target.value.trim().toLowerCase();
		renderMenu();
	});

	languageSelect.addEventListener('change', (event) => {
		state.lang = event.target.value;
		renderStaticText();
		renderFilters();
		renderMenu();
	});
}

function renderFilters() {
	const filterButtonsWrap = document.getElementById('filterButtons');
	
	filterButtonsWrap.innerHTML = menuData.categories.map((category) => {
		const isActive = state.filter === category.id ? 'active' : '';
		const label = category.name[state.lang];
		return `<button class="filter-btn ${isActive}" data-filter="${category.id}">${label}</button>`;
	}).join('');

	document.querySelectorAll('.filter-btn').forEach((button) => {
		button.addEventListener('click', () => {
			state.filter = button.dataset.filter;
			renderFilters();
			renderMenu();
		});
	});
}

function renderMenu() {
	const menuGrid = document.getElementById('menuGrid');
	
	const filteredItems = menuData.items.filter((item) => {
		const byCategory = state.filter === 'all' || item.category === state.filter;
		const localizedName = item.name[state.lang].toLowerCase();
		const localizedDesc = item.description[state.lang].toLowerCase();
		const bySearch = localizedName.includes(state.search) || localizedDesc.includes(state.search);
		return byCategory && bySearch;
	});

	menuGrid.innerHTML = filteredItems.map((item) => `
		<article class="menu-card" data-category="${item.category}">
			<img class="menu-image" src="${item.image}" alt="${item.name[state.lang]}" loading="lazy" />
			<div class="menu-content">
				<h3>${item.name[state.lang]}</h3>
				<p>${item.description[state.lang]}</p>
				<span class="price">${item.price}</span>
			</div>
		</article>
	`).join('');
}

function renderStaticText() {
	document.querySelectorAll('[data-i18n]').forEach((node) => {
		const key = node.dataset.i18n;
		if (translations[state.lang] && translations[state.lang][key]) {
			node.textContent = translations[state.lang][key];
		}
	});

	const searchInput = document.getElementById('menuSearch');
	searchInput.placeholder = translations[state.lang].searchPlaceholder;
	document.documentElement.lang = state.lang;
	document.documentElement.dir = state.lang === 'ar' ? 'rtl' : (state.lang === 'ku' ? 'rtl' : 'ltr');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', loadMenuData);
