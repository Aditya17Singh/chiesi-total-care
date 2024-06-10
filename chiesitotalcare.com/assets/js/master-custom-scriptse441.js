$(function () {
	/**
	 * Header
	 */
	if ($("site-navigation").length) {
		var header = {
			$header: $("header"),
			$siteNavigation: $("site-navigation"),
			MENUTYPES: ["offset-menu", "collapse-menu"],

			eventBinder: function () {
				$(window).on("resize", this.windowResize.bind(this));

				switch (this.menuType) {
					case "offset-menu":
						this.$hamburger.on("click", this.toggleOffsetMenu.bind(this));
						break;
					case "collapse-menu":
						this.$hamburger.on("click", this.toggleCollapseMenu.bind(this));
						break;
					default:
						this.$hamburger.on("click", this.toggleCollapseMenu.bind(this));
						break;
				}
			},
			dropdownSubmenuEventHandler: function () {
				if ($(window).width() > 992) {
					//Remove expanded submenu when screen size is > 992
					this.$dropdownLink
						.removeClass("open")
						.find(".submenu-wrapper")
						.removeClass("show");

					this.$dropdownLink.on("mouseenter", function () {
						$(this).addClass("open").find(".submenu-wrapper").addClass("show");
					});
					this.$dropdownLink.on("mouseleave", function () {
						$(this)
							.removeClass("open")
							.find(".submenu-wrapper")
							.removeClass("show");
					});

					this.$dropdownToggler.off("click");
				} else {
					$(".submenu").off("mouseenter mouseleave");

					//To accomodate if headers submenu is expanded by default and not toggleable
					if (this.shouldSubmenuExpandedByDefault) {
						this.$dropdownLink
							.addClass("open")
							.find(".submenu-wrapper")
							.addClass("show");
					} else {
						//Else Bind event to collapse/expand submenu
						this.$dropdownToggler.on("click", this.toggleCollapseSubmenu);
					}
				}
			},
			toggleOffsetMenu: function (e) {
				e.preventDefault();
				$("body").toggleClass("menu-active");
				$(this.$hamburger).toggleClass("active");
				$(this.navbarTarget).toggleClass("show");
				overlay.toggleOverlay();
			},
			toggleCollapseMenu: function (e) {
				e.preventDefault();
				$(this.$hamburger).toggleClass("active");
				$(this.navbarTarget).collapse("toggle");
			},
			toggleCollapseSubmenu: function (e) {
				e.preventDefault();
				$(this)
					.closest(".submenu")
					.toggleClass("open")
					.find(".submenu-wrapper")
					.collapse("toggle");
			},
			checkHeaderTogglerType: function () {
				let headerClass = this.$siteNavigation.attr("class");

				for (var i = 0; i < this.MENUTYPES.length; i++) {
					if (headerClass.indexOf(this.MENUTYPES[i]) > -1) {
						this.menuType = this.MENUTYPES[i];
					}
				}
			},
			windowResize: function (e) {
				this.dropdownSubmenuEventHandler();
			},
			init: function () {
				//Initialize variables
				this.$hamburger = this.$siteNavigation.find(".js-navbar-toggler");
				this.navbarTarget = this.$hamburger.attr("data-target");
				this.$dropdownLink = this.$siteNavigation.find(".submenu");
				this.$dropdownToggler = this.$siteNavigation.find(
					".submenu-toggle .icon-arrow"
				);
				this.shouldSubmenuExpandedByDefault = this.$siteNavigation.hasClass(
					"expanded-submenu"
				);

				this.checkHeaderTogglerType();
				this.eventBinder();
				this.windowResize();
			},
		};

		header.init();
	}

	/**
	 * Overlay
	 */
	if ($("site-navigation").length && header.menuType == "offset-menu") {
		var overlay = {
			showOverlay: function () {
				this.$overlay.addClass("show");
			},
			hideOverlay: function () {
				this.$overlay.removeClass("show");
			},
			toggleOverlay: function () {
				this.$overlay.toggleClass("show");
			},
			eventBinder: function () {
				var headerRef = header;
				this.$overlay.on("click", function (e) {
					headerRef.toggleOffsetMenu(e);
				});
			},
			init: function () {
				//Initialize variables and create overlay dom
				$("body").append("<div class='overlay'></div>");
				this.$overlay = $(document).find(".overlay");

				//Event Binding
				this.eventBinder();
			},
		};

		overlay.init();
	}

	/**
	 * ISI
	 */
	if ($("isi").length) {
		var isi = {
			eventBinder: function () {
				$(window).on("scroll", this.windowScroll.bind(this));
				this.$isiTriggerBtn.on("click", this.toggleExpand.bind(this));
				this.$isiAnchorLink.on("click", this.anchorISI.bind(this));
				if (this.isIsiMinimize) {
					this.$isiMinimizeBtn.on("click", this.hideMinimizeBtn.bind(this));
				}
			},
			windowScroll: function (e) {
				if (
					$(window).scrollTop() + $(window).height() <
					this.$isi.offset().top
				) {
					this.$isiTray.addClass("show");
				} else {
					this.$isiTray.removeClass("show");
				}
			},
			toggleExpand: function (e) {
				e.preventDefault();
				let btnLabel = this.$isiTriggerBtnLabel.text();
				btnLabel =
					btnLabel == this.collapseText ? this.expandText : this.collapseText;
				this.$isiTriggerBtnLabel.text(btnLabel);
				this.$isi.toggleClass("expand");

				//Hides minimize Btn
				if (this.isIsiMinimize) {
					$("body").toggleClass("isi-expanded");
					this.hideMinimizeBtn(e);
				}
			},
			hideMinimizeBtn: function (e) {
				e.preventDefault();
				this.$isi.addClass("minimize");
				this.$isiMinimizeBtn.hide();
			},
			anchorISI: function (e) {
				e.preventDefault();
				let headerHeight = 0;

				if ($(window).width() > 991) {
					headerHeight =
						$("header .row1").outerHeight() + $("header .row3").outerHeight();
				} else {
					header.toggleOffsetMenu(e);
				}

				$("html, body").animate(
					{
						scrollTop: this.$isi.offset().top - headerHeight,
					},
					1000
				);
			},
			init: function () {
				this.$isi = $("isi");
				this.$isiAnchorLink = $("a[href='#isi']");
				this.$isiTray = this.$isi.find(".isi__tray");
				this.$isiTrayContent = this.$isi.find(".isi__tray-content");
				this.$isiTriggerBtn = this.$isi.find(".isi__tray-trigger-btn");
				this.$isiMinimizeBtn = this.$isi.find(".isi__tray-minimize-btn");

				this.$isiTriggerBtnLabel = this.$isiTriggerBtn.find("span");
				this.collapseText = this.$isiTriggerBtn.attr("data-collapse-text");
				this.expandText = this.$isiTriggerBtn.attr("data-expand-text");
				this.isIsiMinimize = this.$isi.hasClass("isi--minimize");
				this.eventBinder();
				this.windowScroll();
			},
		};

		isi.init();
	}

	/**
	 * Generic Modal & HCP Modal
	 */
	if ($("#modal").length && $(".dialog-content").length) {
		var modal = {
			_$modal: $("#modal"),
			_$modalTriggerCTA: $("[data-trigger='modal']"),
			_$dialogContent: $(".dialog-content"),
			_modalContent: {},
			eventBinder: function () {
				this._$modalTriggerCTA.on("click", this.bindModal.bind(this));
				this._$modalCTABtn.on("click", this.hideModal.bind(this));
				this._$modal.on("hidden.bs.modal", this.resetModalContent.bind(this));
			},
			showModalwithBackdropNotclickable: function (e) {
				this._$modal.modal({
					backdrop: "static",
					keyboard: false,
				});
			},
			showModal: function (e) {
				this._$modal.modal("show");
			},
			hideModal: function (e) {
				this._$modal.modal("hide");
			},
			bindModal: function (e) {
				e.preventDefault();

				var $this = $(e.currentTarget);

				//fetch modal type
				this._modalType = $this.attr("data-modal-type");

				//fetch modal data
				this.fetchModalData();

				this._modalContent["cta"] = $this.attr("href");
				this._modalContent["isTargetBlank"] =
					$this.attr("target") == "_blank" ? true : false;

				//Initialize modal data to markup
				this._$modal.on("show.bs.modal", this.templateModal.bind(this));

				if (this._modalBackdropNotClickable) {
					this.showModalwithBackdropNotclickable();
				} else {
					this.showModal();
				}
			},
			fetchModalData: function () {
				//Reset previous data
				this._modalContent = {};

				//Fetch modal type data
				switch (this._modalType) {
					case "external":
						this._modalContent["heading"] = this._$dialogContent
							.find(".externalHeading")
							.html();
						this._modalContent["body"] = this._$dialogContent
							.find(".externalBody")
							.html();
						this._modalContent["continue"] = this._$dialogContent
							.find(".externalButtonContinue")
							.html();
						this._modalContent["cancel"] = this._$dialogContent
							.find(".externalButtonCancel")
							.html();
						this._$modal.attr("aria-label", "externalModal");
						break;

					case "hcp":
						this._modalContent["heading"] = this._$dialogContent
							.find(".hcpHeading")
							.html();
						this._modalContent["body"] = this._$dialogContent
							.find(".hcpBody")
							.html();
						this._modalContent["continue"] = this._$dialogContent
							.find(".hcpButtonContinue")
							.html();
						this._modalContent["cancel"] = this._$dialogContent
							.find(".hcpButtonCancel")
							.html();
						this._$modal.attr("aria-label", "hcpModal");
						break;
				}
			},
			templateModal: function (event) {
				//Template the modal to dynamic content
				this.templateHeaderContent();
				this.templateBodyContent();
				this.templateFooterContent();
			},
			templateHeaderContent: function () {
				if (this._modalContent["heading"]) {
					this._$modalTitle.html(this._modalContent["heading"]);
				} else {
					this._$modalHeader.hide();
				}
			},
			templateBodyContent: function () {
				this._$modalBody.html(this._modalContent["body"]);
			},
			templateFooterContent: function () {
				//Dismiss Button
				if (this._modalContent["cancel"]) {
					this._$modal
						.find(".modal-footer #dismiss-btn")
						.html(this._modalContent["cancel"]);
				} else {
					this._$modalDismissBtn.hide();
				}
				//CTA Button
				if (this._modalContent["continue"]) {
					if (this._modalContent["isTargetBlank"]) {
						this._$modalCTABtn.attr("target", "_blank");
					}
					this._$modalCTABtn
						.attr("href", this._modalContent["cta"])
						.html(this._modalContent["continue"]);
				} else {
					this._$modalCTABtn.hide();
				}
			},
			resetModalContent: function () {
				this._$modalHeader.removeAttr("style");
				this._$modalTitle.html("");
				this._$modalBody.html("");
				this._$modalDismissBtn.removeAttr("style").html("");
				this._$modalCTABtn.removeAttr("style").html("");
				this._$modal.attr("aria-label", "genericModal");
			},
			init: function () {
				this._$modalHeader = this._$modal.find(".modal-header");
				this._$modalTitle = this._$modal.find(".modal-title");
				this._$modalBody = this._$modal.find(".modal-body");
				this._$modalDismissBtn = this._$modal.find(
					".modal-footer #dismiss-btn"
				);
				this._$modalCTABtn = this._$modal.find(".modal-footer #cta-btn");
				this._modalBackdropNotClickable = this._$modal.hasClass(
					"modal--backdropUnclickable"
				);
				this.eventBinder();
			},
		};

		modal.init();
	}

	/**
	 * Welcome Modal
	 */
	if ($("#welcome-modal").length) {
		var welcomeModal = {
			_$modal: $("#welcome-modal"),
			eventBinder: function () {
				this._$modalYesBtn.on("click", this.hideModalAndSetLocal.bind(this));
				this._$modalNoBtn.on("click", this.hideModal.bind(this));
			},
			showModal: function (e) {
				this._$modal.modal({
					backdrop: "static",
					keyboard: false,
				});
			},
			hideModal: function (e) {
				this._$modal.modal("hide");
			},
			hideModalAndSetLocal: function (e) {
				e.preventDefault();

				//Set Local storage flag for the modal
				localStorage.setItem("isHCPModalAcknowledged", true);

				this.hideModal();
			},
			init: function () {
				this._$modalYesBtn = this._$modal.find(".modal-footer #yes");
				this._$modalNoBtn = this._$modal.find(".modal-footer #no");
				this.eventBinder();

				//Show Modal on Load of the page
				if (localStorage.getItem("isHCPModalAcknowledged") == null) {
					this.showModal();
				}
			},
		};

		welcomeModal.init();
	}

	/**
	 * Photo Gallery
	 */

	var photoGallery = {
		_$ctaGallery: $(".js-toggle-gallery"),
		eventBinder: function () {
			this._$ctaGallery.on("click", this.toggleGallery.bind(this));
		},
		toggleGallery: function () {
			var pswpElement = document.querySelectorAll(".pswp")[0];

			// define options (if needed)
			var options = {
				index: 0,
				bgOpacity: 0.7,
				closeOnScroll: false,
				history: false,
				getDoubleTapZoom: function (isMouseClick, item) {
					//zoom level
					return 3;
				},
			};

			// Initializes and opens PhotoSwipe
			var gallery = new PhotoSwipe(
				pswpElement,
				PhotoSwipeUI_Default,
				this._galleryItems,
				options
			);
			gallery.init();
		},
		fetchGalleryData: function () {
			let imgPath = this._$ctaGallery.find("#image-url").html();
			let slideContent = this._$ctaGallery.find("#sub-html").html();
			this._galleryItems.push({
				src: imgPath,
				title: slideContent,
				w: 1100,
				h: 610,
			});
		},
		init: function () {
			//Fetch the markup and append to body
			let galleryTemplate = $("#gallery-template").html();
			$("body").append(galleryTemplate);

			this._galleryItems = [];
			this.fetchGalleryData();
			this.eventBinder();
		},
	};

	photoGallery.init();

	/**
	 * Accordion
	 */

	if ($("accordion").length) {
		var accordion = {
			_$accordion: $("accordion"),
			eventBinder: function () {
				this._$expandBtn.on("click", this.expandAll.bind(this));
				this._$collapseBtn.on("click", this.collapseAll.bind(this));

				//Only bind this event if expand/collapse all functionality is authored
				if (this._isExpandCollapseAll) {
					this._$accordionToggle.on("click", this.toggleAccordion.bind(this));
				}
			},
			expandAll: function (e) {
				var $this = $(e.currentTarget);
				$this.closest("accordion").find(".collapse").collapse("show");
			},
			collapseAll: function (e) {
				var $this = $(e.currentTarget);
				$this.closest("accordion").find(".collapse").collapse("hide");
			},
			toggleAccordion: function (e) {
				//Prevent data-attr based toggle to happen
				e.stopPropagation();

				var $this = $(e.currentTarget);
				var target = $this.attr("data-target");
				var $parentAccordion = $this.closest("accordion");

				//If only one accordion is open toggle its state
				if ($parentAccordion.find(".collapse.show").length == 1) {
					$parentAccordion.find(".collapse.show").collapse("toggle");
				}

				$(target).collapse("toggle");
			},
			anchorBasedOnHash: function () {
				if (location.hash !== null && location.hash !== "") {
					$(location.hash + ".collapse").collapse("show");
				}
			},
			init: function () {
				this._$accordionToggle = this._$accordion.find(
					"[data-toggle='collapse']"
				);
				this._isExpandCollapseAll = this._$accordion.hasClass(
					"accordion--expandCollapseAll"
				);
				this._$expandBtn = this._$accordion.find(".js-expand");
				this._$collapseBtn = this._$accordion.find(".js-collapse");

				this.anchorBasedOnHash();
				this.eventBinder();
			},
		};

		accordion.init();
	}

	$(".collapse.show").each(function () {
		$(this)
			.prev(".card-header")
			.find("span")
			.addClass("icon-close")
			.removeClass("icon");
	});
	// Toggle plus cross icon on show hide of collapse element
	$(".collapse")
		.on("show.bs.collapse", function () {
			$(this)
				.prev(".card-header")
				.find("span")
				.removeClass("icon")
				.addClass("icon-close");
		})
		.on("hide.bs.collapse", function () {
			$(this)
				.prev(".card-header")
				.find("span")
				.removeClass("icon-close")
				.addClass("icon");
		});

	// news banner close icon
	$(".news-banner-close").click(function () {
		$(this).closest("news-banner").hide();
	});

	// Reference toggle
	if ($(".reference-content").hasClass("ref-accordion")) {
		$(".ref-accordion .content-wrap").on("click", function (e) {
			$(this).closest(".ref-accordion").find(".reference-list").toggle();
			var child = $(this).children();
			if (child.hasClass("fa fa-plus-circle"))
				child.removeClass("fa fa-plus-circle").addClass("fa fa-minus-circle");
			else
				child.removeClass("fa fa-minus-circle").addClass("fa fa-plus-circle");

			return false;
		});
	}
	// View Transcript Functionality

	$(".video-description .view_transcript").on("click", function (e) {
		e.preventDefault();
		$(".video-hidden-description").toggleClass("show");
	});

	// video Tab Funcionality

	$(".video-tile").click(function () {
		$(".video-list-wrapper").removeClass("disable");
		$(".video-list-wrapper").removeClass("play");
		$(this).addClass("play");
		$(this).addClass("disable");

		// paragaraph data update
		let paraData = $(this).children().find("p").text();
		$(".video-description  p").text(paraData);

		let videoData = $(this).attr("data-url");
		let videoSource = $("video source");
		videoSource.attr("src", videoData);
		let autoplayVideo = $("video").get(0);
		autoplayVideo.setAttribute("controls", "controls");
		autoplayVideo.load();
		autoplayVideo.play();
	});

	// $(".video-tile-iframe").click(function () {
	// 	$(".video-list-wrapper").removeClass("disable");
	// 	$(".video-list-wrapper").removeClass("play");
	// 	$(this).addClass("play");
	// 	$(this).addClass("disable");

	// 	// paragaraph data update
	// 	let paraData = $(this).children().find("p").text();
	// 	$(".video-description  p").text(paraData);

	// 	let videoData_v1 = $(this).attr("data-url");
	// 	$(".video-collection-wrapper iframe").attr("src", videoData_v1);
	// });
	$(".video-tile-iframe").click(function () {
		var parent = $(this).parents(".video-collection-wrapper");
		parent.find(".video-list-wrapper").removeClass("play");
		$(this).addClass("play");
		setVideoDesc($(this), parent, true);
	});

	$(".video-collection-wrapper .video-tile-iframe.play").each(function () {
		var parent = $(this).parents(".video-collection-wrapper");
		setVideoDesc($(this), parent);
	});

	function setVideoDesc(el, parent, autoplay) {
		var altText = el.children().find("p").data("alttext");
		var paraData = el.children().find("p").data("primarytext");
		el.children().find("p").text(altText);
		parent.find(".video-description  p").text(paraData);
		var videoData_v1 = el.attr("data-url");
		if (autoplay) {
			parent
				.find("iframe")
				.attr("src", videoData_v1 + "?autoplay=1")
				.attr("allow", "autoplay");
			//parent.parent().parent().find("iframe").attr('src', videoData_v1 + '?autoplay=1').attr('allow', "autoplay");
		} else {
			parent.find("iframe").attr("src", videoData_v1);
		}
		parent.find(".iframe-play-icon").addClass("hide");
	}
	
	/*Resources section link scroll to top */
$('.resources-wrapper .secondary-content .content-selector-wrapper a[href^="#"]').on('click', function(event) {
  var target = $(this.getAttribute ('href') );
  if (target.length) {
    event.preventDefault();
    $('html, body').stop().animate( {
      scrollTop: target.offset().top-150
    }, 600);
  }
});


let heroBg = $('.hero-bg');
let heroBgContact = $('.hero-bg-contact');

if (heroBg.hasClass('container')) {
  heroBg.removeClass('container');
}
if (heroBgContact.hasClass('container')) {
  heroBgContact.removeClass('container');
} 

});