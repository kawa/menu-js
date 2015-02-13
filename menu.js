var MenuItem = function(name) {
	this.name = name;
	this.action = 0;
	this.focused = 0;
	this.element = function() {
		return $(this.name);
	}
	this.focus = function() {
		this.element().style.color = "#0f0";
		this.element().style.borderColor = "#0f0";
		if (this.focused)
			this.focused();
	}
	this.blur = function() {
		this.element().style.color = "#fff";
		this.element().style.borderColor = "#fff";
	}
	this.go = function() {
		if (this.action)
			this.action();
		else
			this.element().focus();
	}
}

var Menu = function() {
	this.menuItems = [];
	this.current = 0;
	this.append = function(menuItem) {
		this.menuItems.push(menuItem);
	}
	this.next = function() {
		if (this.current < this.menuItems.length - 1) {
			this.menuItems[this.current].blur();
			this.current++;
			this.menuItems[this.current].focus();
		}
	}
	this.prev = function() {
		if (this.current > 0) {
			this.menuItems[this.current].blur();
			this.current--;
			this.menuItems[this.current].focus();
		}
	}
	this.go = function() {
		this.menuItems[this.current].go();
	}
	this.reset = function() {
		this.current = 0;
		for (var i = 0; i < this.menuItems.length; i++) {
			if (i == 0)
				this.menuItems[i].focus();
			else
				this.menuItems[i].blur();
		}
	}
}

var Screen = function(name) {
	this.screenName = name;
	this._menu = 0;
	this.modal = false;
	this.element = function() {
		return $(this.screenName);
	}
	this.setMenu = function(menu) {
		this._menu = menu;
	}
	this.menu = function() {
		return this._menu;
	}
	this.show = function() {
		this.element().style.display = "block";
		if (this._menu)
			this._menu.reset();
	}
	this.hide = function() {
		this.element().style.display = "none";
	}
}

var ScreenManager = new (function() {
	this.screenSet = {};
	this.currentScreen = 0;
	this.screenStack = [];
	this.onload = 0;
	this.append = function(screenObj) {
		this.screenSet[screenObj.screenName] = screenObj;
	}
	this.screen = function(name) {
		for (var i in this.screenSet) {
			if (this.screenSet[i].screenName == name) return this.screenSet[i];
		}
		return 0;
	}
	this.present = function(name) {
		var screen = this.screen(name);
		if (!screen) return;
		if (this.currentScreen)
			this.currentScreen.hide();
		this.currentScreen = screen;
		this.currentScreen.show();
		if (!this.currentScreen.modal)
			this.screenStack.push(this.currentScreen);
	}
	this.current = function() {
		return this.currentScreen;
	}
	this.dismiss = function() {
		if (this.currentScreen.modal) {
			this.currentScreen.hide();
			this.currentScreen = this.screenStack[this.screenStack.length - 1];
			this.currentScreen.show();
			return;
		}
		if (this.screenStack.length <= 1)
			return;
		if (this.currentScreen)
			this.currentScreen.hide();
		this.screenStack.pop();
		this.currentScreen = this.screenStack[this.screenStack.length - 1];
		this.currentScreen.show();
	}
	this.clearScreenStack = function() {
		this.screenStack = [];
	}
})();

function keydown(event) {
	switch(event.keyCode) {
	case 40: // Down
		var menu = ScreenManager.current().menu();
		if (menu) menu.next();
		break;
	case 38: // Up
		var menu = ScreenManager.current().menu();
		if (menu) menu.prev();
		break;
	case 47: // Left
		break;
	case 39: // Right
		break;
	case 13: // Enter
		var menu = ScreenManager.current().menu();
		if (menu) menu.go();
		break;
	case 27: // Escape
		if (!ScreenManager.current().modal)
			ScreenManager.dismiss();
		break;
	default:
		break;
	}
}

window.onload = function() {
	window.addEventListener("keydown", keydown);
	if (ScreenManager.onload) ScreenManager.onload();
}
