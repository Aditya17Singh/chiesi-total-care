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
        this.shouldSubmenuExpandedByDefault =
          this.$siteNavigation.hasClass("expanded-submenu");

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
  $(
    '.resources-wrapper .secondary-content .content-selector-wrapper a[href^="#"]'
  ).on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 150,
          },
          600
        );
    }
  });

  let heroBg = $(".hero-bg");
  let heroBgContact = $(".hero-bg-contact");

  if (heroBg.hasClass("container")) {
    heroBg.removeClass("container");
  }
  if (heroBgContact.hasClass("container")) {
    heroBgContact.removeClass("container");
  }
});

// eb-calculator
function openTab(event, tabName) {
  // Get all elements with class="tab" and hide them
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }

  // Get all elements with class="tab-button" and remove the active class
  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
}

//Rules of 9

$("#bsa-feet").hide();
$("#bsa-inches").hide();

function updateHeightInputs(units) {
  if (units == "cms") {
    $("#bsa-height").show();
    $("#bsa-feet").hide();
    $("#bsa-inches").hide();
  } else {
    $("#bsa-feet").show();
    $("#bsa-inches").show();
    $("#bsa-height").hide();
  }
}

//Hide Step 1 Result
$("#bsa-result").hide();
//Hide All Next Steps
$("#step2-box").hide();
$("#step3-box").hide();
$("#sidebar").hide();
$("#kid-box").hide();
$("#butt-aff-label").hide();
$("#butt-aff").hide();
$("#aff-result").hide();

var bsaValue; // Declare bsaValue as a global variable
var epaaValue;
var aaaValue;
var tubesperValue;
var tubessuppValue;

function loadStep1() {
  console.log("Calculate BSA");
  $("#error-message-for-step1").hide().text("");

  //Get Weight
  var bsaw = $("#bsa-weight").val();
  //Check Weight Units
  var bsawunits = $("#bsa-weight-units").val();
  if (bsawunits == "pds") {
    bsaw = bsaw / 2.20462;
    console.log("KGS: " + bsaw);
  }

  // Validate Weight
  if (bsaw <= 0) {
    $("#error-message-for-step1").text("Please complete all fields.").show();
    return;
  }

  //Get Height
  var bsah = $("#bsa-height").val();
  //Check Height Units
  var bsahunits = $("#bsa-height-units").val();
  var feet = $("#bsa-feet").val();
  var inches = $("#bsa-inches").val();
  if (bsahunits == "inch") {
    bsah = feet * 30.48 + inches * 2.54;
    console.log("CMS: " + bsah);
  }

  let unitOfHeight = document
    .getElementById("bsa-height-units")
    .getAttribute("data-value");
  let initialUnitOfHeight =
    document.getElementById("bsa-height-units").innerHTML;

  // Validate height
  if (
    (bsah <= 0 && (unitOfHeight == "cms" || initialUnitOfHeight === "cms")) ||
    (feet <= 0 && unitOfHeight === "inch") ||
    (inches <= 0 && unitOfHeight === "inch")
  ) {
    $("#error-message-for-step1").text("Please complete all fields.").show();
    return;
  }

  console.log($("#bsa-height"), "bsah");
  // Validate Height based on the selected units
  if (bsahunits == "cms" && bsah <= 0) {
    $("#error-message-for-step1").text("Please complete all fields.").show();
    return;
  } else if (bsahunits == "inch" && (feet <= 0 || inches < 0)) {
    $("#error-message-for-step1").text("Please complete all fields.").show();
    return;
  }

  //Apply formula
  console.log(bsaw, bsah, "bsaw and bsah");
  var bsa = 0.0071874 * bsaw ** 0.425 * bsah ** 0.725;
  console.log("BSA " + bsa.toFixed(2) + "m2");
  bsaValue = bsa; // Set the global variable

  //Show Result
  $("#bsa-result").text("BSA: " + bsa.toFixed(2) + " m2");
  $("#bsa-result").show();
  //Show Next Step
  $("#step2-box").show();

  $("#bsa-value").val(bsa.toFixed(2) * 10000);

  $("#bsa-weight").attr("disabled", true);
  $("#bsa-height").attr("disabled", true);
  $("#bsa-weight-units").attr("disabled", true);
  $("#bsa-height-units").attr("disabled", true);
  $("#bsa-gender").attr("disabled", true);
  $("#step1-btn").hide();
}

function backStep1() {
  $("#bsa-weight").attr("disabled", false);
  $("#bsa-height").attr("disabled", false);
  $("#bsa-weight-units").attr("disabled", false);
  $("#bsa-height-units").attr("disabled", false);
  $("#bsa-gender").attr("disabled", false);
  $("#step1-btn").show();
  //Hide Step 2
  $("#step2-box").hide();
}

function updatePatientType(type) {
  if (type == "kid") {
    $("#kid-box").show();
    $("#butt-aff-label").show();
    $("#butt-aff").show();
  } else {
    $("#kid-box").hide();
    $("#butt-aff-label").hide();
    $("#butt-aff").hide();
  }
}

function loadStep2() {
  console.log("Calculate EPAA");

  $("#error-message-for-step2").hide().text("");

  // Validate affected area percentages
  var inputs = [
    "#head-aff",
    "#trunkf-aff",
    "#rarm-aff",
    "#larm-aff",
    "#gnp-aff",
    "#rleg-aff",
    "#lleg-aff",
    "#trunkb-aff",
    "#butt-aff",
  ];

  var allZero = true;
  for (var i = 0; i < inputs.length; i++) {
    var val = parseFloat($(inputs[i]).val());

    if (val > 0) {
      allZero = false;
    }
  }

  if (allZero) {
    $("#error-message-for-step2")
      .text("Please enter a value greater than 0 for at least one field.")
      .show();
    return;
  }

  var head = 0.09;
  var ftrunk = 0.18;
  var rarm = 0.09;
  var larm = 0.09;
  var gnp = 0.01;
  var rleg = 0.18;
  var lleg = 0.18;
  var btrunk = 0.18;
  var butt = 0.0;

  //Get Patient Type
  var patient = $("#patient-type").val();
  if (patient == "kid") {
    ftrunk = 0.13;
    rarm = 0.1;
    larm = 0.1;
    gnp = 0.01;
    btrunk = 0.13;
    butt = 0.05;
    //Get Kid Age
    var age = $("#kid-age").val();
    if (age == "0") {
      head = 0.21;
      rleg = 0.14;
      lleg = 0.14;
    } else if (age == "1") {
      head = 0.19;
      rleg = 0.15;
      lleg = 0.15;
    } else if (age == "5") {
      head = 0.15;
      rleg = 0.17;
      lleg = 0.17;
    } else if (age == "10") {
      head = 0.13;
      rleg = 0.185;
      lleg = 0.185;
    } else {
      head = 0.11;
      rleg = 0.19;
      lleg = 0.19;
    }
  }

  var affhead = head * ($("#head-aff").val() / 100);
  var affftrunk = ftrunk * ($("#trunkf-aff").val() / 100);
  var affrarm = rarm * ($("#rarm-aff").val() / 100);
  var afflarm = larm * ($("#larm-aff").val() / 100);
  var affgnp = gnp * ($("#gnp-aff").val() / 100);
  var affrleg = rleg * ($("#rleg-aff").val() / 100);
  var afflleg = lleg * ($("#lleg-aff").val() / 100);
  var affbtrunk = btrunk * ($("#trunkb-aff").val() / 100);
  var affbutt = butt * ($("#butt-aff").val() / 100);

  //Apply formula
  var epaa =
    (affhead +
      affftrunk +
      affrarm +
      afflarm +
      affgnp +
      affrleg +
      afflleg +
      affbtrunk +
      affbutt) *
    100;
  console.log("EPAA " + epaa.toFixed(2) + "%");
  console.log(epaa, "ewtrwtrety");
  epaaValue = epaa;
  //Show Result
  $("#aff-result").text("EPAA: " + epaa.toFixed(2) + "%");
  $("#aff-result").show();
  //Show Next Step
  $("#step3-box").show();
  var bsa = $("#bsa-value").val();
  var aaa = (bsa * epaa) / 100;
  console.log(bsa, epaa, "12321");
  aaaValue = aaa;
  $("#aaa-result").text("AAA: " + aaa.toFixed(2) + " cm2");

  $("#aaa-value").val(aaa.toFixed(2));

  $("#step2-btn").hide();
  $("#step2-btn-back").hide();

  $("#head-aff").attr("disabled", true);
  $("#trunkf-aff").attr("disabled", true);
  $("#rarm-aff").attr("disabled", true);
  $("#larm-aff").attr("disabled", true);
  $("#gnp-aff").attr("disabled", true);
  $("#rleg-aff").attr("disabled", true);
  $("#lleg-aff").attr("disabled", true);
  $("#trunkb-aff").attr("disabled", true);
  $("#butt-aff").attr("disabled", true);
}

$("#step2-btn-back").click(function () {
  $("#error-message-for-step2").hide().text("");
});

function backStep2() {
  $("#head-aff").attr("disabled", false);
  $("#trunkf-aff").attr("disabled", false);
  $("#rarm-aff").attr("disabled", false);
  $("#larm-aff").attr("disabled", false);
  $("#gnp-aff").attr("disabled", false);
  $("#rleg-aff").attr("disabled", false);
  $("#lleg-aff").attr("disabled", false);
  $("#trunkb-aff").attr("disabled", false);
  $("#butt-aff").attr("disabled", false);
  $("#step2-btn").show();
  $("#step2-btn-back").show();
  //Hide Step 2
  $("#step3-box").hide();
}

function loadStep3() {
  var tubesper = Math.ceil($("#aaa-value").val() / 250);
  console.log(tubesper, "tubesper");
  tubesperValue = tubesper;
  $("#tubes-per").text(tubesper);
  $("#tubes-value").val(tubesper);
  $("#sidebar").show();
  var tubessupp = Math.ceil(tubesper * 30);
  $("#tubes-total").text(tubessupp);
  $("#step3-btn").hide();
  $("#step3-btn-back").hide();
  tubessuppValue = tubessupp;
}
console.log($("#tubes-total").value, "area");
function loadMonthSupply(freq) {
  var tubessupp = Math.ceil($("#tubes-value").val() * parseInt(freq));
  console.log(tubessupp, "tubessupp");
  tubessuppValue = tubessupp;
  $("#tubes-total").text(tubessupp);
}

function reloadForm() {
  window.location.href = "/";
}

// Direct Measurement
$("#bsa-feet").hide();
$("#bsa-inches").hide();

function updateHeightInputsDirectMeasurement(units) {
  if (units == "cms") {
    $("#bsa-height").show();
    $("#bsa-feet").hide();
    $("#bsa-inches").hide();
  } else {
    $("#bsa-feet").show();
    $("#bsa-inches").show();
    $("#bsa-height").hide();
  }
}

//Hide Step 1 Result
$("#bsa-result").hide();
//Hide All Next Steps
$("#sidebar-direct-measurement").hide();
$("#kid-box").hide();
$("#butt-aff-label").hide();
$("#butt-aff").hide();
$("#aff-result").hide();

function loadStep3DirectMeasurement() {
  var inputValue = $("#aaa-value-direct-measurement").val();
  if (inputValue > 0) {
    $("#aaa-value-direct-measurement").prop("disabled", true);
    var tubesper = Math.ceil(inputValue / 250);
    $("#tubes-per-direct-measurement").text(tubesper);
    $("#tubes-value-direct-measurement").val(tubesper);
    $("#sidebar-direct-measurement").show();
    var tubessupp = Math.ceil(tubesper * 30);
    $("#tubes-total-direct-measurement").text(tubessupp);
    $("#step3-btn-direct-measurement").hide();
    $("#step3-btn-back").hide();
    $("#error-message").hide();
  } else {
    $("#error-message").show();
  }
}

function loadMonthSupplyDirectMeasurement(freq) {
  var tubessupp = Math.ceil(
    $("#tubes-value-direct-measurement").val() * parseInt(freq)
  );
  $("#tubes-total-direct-measurement").text(tubessupp);
}

function reloadFormDirectMeasurement() {
  window.location.href = "direct-measurement.html";
}

// form
var weightUnitsValue;
var genderUnitsValue;
var heightUnitsValue;
var patientTypeValue;
var dressingChangeValue = "Everyday";
var kidTypeValue = "0-1 year";
var heightUnitDirectValue;

document
  .getElementById("submit-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Clear any previous error messages
    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    // Get form fields
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validation
    let isValid = true;

    if (firstName === "") {
      isValid = false;
      showError("first-name", "First name is required.");
    }

    if (lastName === "") {
      isValid = false;
      showError("last-name", "Last name is required.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      isValid = false;
      showError("email", "Please enter a valid email address.");
    }

    if (!isValid) {
      return;
    }

    // Gather form data
    const formData = {
      calculateType: "Rule's of 9",
      firstName: firstName,
      lastName: lastName,
      email: email,
      weight: document.getElementById("bsa-weight").value,
      weightUnits: weightUnitsValue,
      gender: genderUnitsValue,
      height:
        document.getElementById("bsa-height").value ||
        `${document.getElementById("bsa-feet").value} ft` +
          " " +
          `${document.getElementById("bsa-inches").value} inch`,
      heightUnits: heightUnitsValue,
      bsa: bsaValue.toFixed(2) + "m2",
      headAndNeck: $("#head-aff").val(),
      trunkFront: $("#trunkf-aff").val(),
      rightArm: $("#rarm-aff").val(),
      leftArm: $("#larm-aff").val(),
      genitaliaAndPerineum: $("#gnp-aff").val(),
      rightLegAndFoot: $("#rleg-aff").val(),
      leftLegAndFoot: $("#lleg-aff").val(),
      trunkBack: $("#trunkb-aff").val(),
      buttocks: $("#butt-aff").val(),
      epaa: epaaValue,
      patientType: patientTypeValue,
      aaaValue: aaaValue,
      tubesperValue: tubesperValue,
      tubessuppValue: tubessuppValue,
      dressingsChanged: dressingChangeValue,
      ageOfPatient: kidTypeValue,
    };

    console.log(formData, "formData");

    // Send data to API
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        if (data.success) {
          document.getElementById("success-message").innerText =
            "Form submitted successfully!";
        } else {
          document.getElementById("error-message-form").innerText =
            "Error submitting form";
        }
      })
      .catch((error) => {
        document.getElementById("error-message-form").innerText =
          "Error submitting form";
        console.error("Error:", error);
      });
  });

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerText = message;
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// for custom select option
document.addEventListener("DOMContentLoaded", () => {
  // Function to initialize custom dropdown
  function initializeCustomDropdown(selectBoxId, optionsContainerId) {
    const selectBox = document.getElementById(selectBoxId);
    const optionsContainer = document.getElementById(optionsContainerId);

    // Check if optionsContainer exists
    if (!optionsContainer) {
      console.error(
        `Options container with ID ${optionsContainerId} not found`
      );
      return () => null;
    }

    const optionsList = optionsContainer.querySelectorAll(".option");

    let selectedValue = null;

    if (optionsList.length > 0 && !selectBox.hasAttribute("disabled")) {
      const firstOption = optionsList[0];
      selectBox.textContent = firstOption.textContent;
      selectedValue = firstOption.getAttribute("data-value");
      selectBox.removeAttribute("data-placeholder");
    }

    selectBox.addEventListener("click", () => {
      if (!selectBox.hasAttribute("disabled")) {
        optionsContainer.style.display =
          optionsContainer.style.display === "block" ? "none" : "block";
      }
    });

    optionsList?.forEach((option) => {
      option.addEventListener("click", () => {
        if (!selectBox.hasAttribute("disabled")) {
          selectBox.textContent = option.textContent;
          selectedValue = option.getAttribute("data-value");
          selectBox.setAttribute("data-value", selectedValue);
          selectBox.removeAttribute("data-placeholder");
          optionsContainer.style.display = "none";
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        optionsContainer.style.display = "none";
      }
    });

    return () => selectedValue;
  }

  // Initialize custom dropdowns
  const getWeightUnitsValue = initializeCustomDropdown(
    "bsa-weight-units",
    "weightOptionsContainer"
  );
  const getHeightUnitsValue = initializeCustomDropdown(
    "bsa-height-units",
    "heightOptionsContainer"
  );
  const getGenderUnitsValue = initializeCustomDropdown(
    "bsa-gender",
    "genderOptionsContainer"
  );

  const getPatientTypeValue = initializeCustomDropdown(
    "patient-type",
    "patientTypeOptionsContainer"
  );

  const getDressingsChangeValue = initializeCustomDropdown(
    "dressing-change",
    "dressingsChangeOptionsContainer"
  );

  const getKidValue = initializeCustomDropdown(
    "kid-age",
    "kidOptionsContainer"
  );
  const getHeightUnitsValueForDirect = initializeCustomDropdown(
    "bsa-height-units-direct",
    "heightOptionsContainerDirect"
  );

   const getDressingsChangeValueDirect = initializeCustomDropdown(
     "dressing-change-direct",
     "dressingsChangeOptionsContainerDirect"
   );

  weightUnitsValue = getWeightUnitsValue();
  heightUnitsValue = getHeightUnitsValue();
  genderUnitsValue = getGenderUnitsValue();
  patientTypeValue = getPatientTypeValue();
  kidTypeValue = getKidValue();
  heightUnitDirectValue = getHeightUnitsValueForDirect();

  // dressingChangeValue = getDressingsChangeValue();
  loadMonthSupply(getDressingsChangeValue());

  // Update the global variables when the values change
  document
    .getElementById("weightOptionsContainer")
    .addEventListener("click", (e) => {
      weightUnitsValue = e.target.dataset.value;
    });

  document
    .getElementById("heightOptionsContainer")
    .addEventListener("click", (e) => {
      document.getElementById("bsa-height").value = "";
      let units = e.target.dataset.value;
      heightUnitsValue = units;
      if (units == "cms") {
        $("#bsa-height").show();
        $("#bsa-feet").hide();
        $("#bsa-inches").hide();
      } else {
        $("#bsa-feet").show();
        $("#bsa-inches").show();
        $("#bsa-height").hide();
      }
    });

  document
    .getElementById("genderOptionsContainer")
    .addEventListener("click", (e) => {
      genderUnitsValue = e.target.dataset.value;
    });

  document
    .getElementById("patientTypeOptionsContainer")
    .addEventListener("click", (e) => {
      patientTypeValue = e.target.dataset.value;
      updatePatientType(e.target.dataset.value);
    });

  document
    .getElementById("dressingsChangeOptionsContainer")
    .addEventListener("click", (e) => {
      dressingChangeValue = e.target.innerText.trim();
      loadMonthSupply(e.target.dataset.value);
    });

  document
    .getElementById("kidOptionsContainer")
    .addEventListener("click", (e) => {
      kidTypeValue = e.target.innerText.trim();
    });

  document
    .getElementById("heightOptionsContainerDirect")
    .addEventListener("click", (e) => {
      heightUnitDirectValue = e.target.innerText.trim();
    });
});

// hide show form rule of 9
document.getElementById("email-btn").addEventListener("click", function () {
  const formContainer = document.getElementById("form-container-calculator");
  if (formContainer.classList.contains("hidden-calculator-form")) {
    formContainer.classList.remove("hidden-calculator-form");
    formContainer.classList.add("show-calculator-form");
  } else {
    formContainer.classList.remove("show-calculator-form");
    formContainer.classList.add("hidden-calculator-form");
  }
});
// form direct
document
  .getElementById("email-btn-direct")
  .addEventListener("click", function () {
    const formContainer = document.getElementById(
      "form-container-calculator-direct"
    );
    if (formContainer.classList.contains("hidden-calculator-form")) {
      formContainer.classList.remove("hidden-calculator-form");
      formContainer.classList.add("show-calculator-form");
    } else {
      formContainer.classList.remove("show-calculator-form");
      formContainer.classList.add("hidden-calculator-form");
    }
  });

document
  .getElementById("submit-btn-direct")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Clear any previous error messages
    document
      .querySelectorAll(".error-message-direct")
      .forEach((el) => (el.textContent = ""));

    // Get form fields
    const firstName = document.getElementById("first-name-direct").value.trim();
    const lastName = document.getElementById("last-name-direct").value.trim();
    const email = document.getElementById("email-direct").value.trim();

    const actualAffectedAreaValue = document
      .getElementById("aaa-value-direct-measurement")
      .value.trim();

    const unitsAffectedAreaValue = document
      .getElementById("bsa-height-units-direct")
      ?.getAttribute("data-value")
      ?.trim();

    const totalTubesRequiredDirect = document
      .getElementById("tubes-per-direct-measurement")
      .textContent.trim();

    const tubesTotalRequiredDirect = document
      .getElementById("tubes-total-direct-measurement")
      .textContent.trim();

    // Validation
    let isValid = true;

    if (firstName === "") {
      isValid = false;
      showError("error-first-name-direct", "First name is required.");
    }

    if (lastName === "") {
      isValid = false;
      showError("error-last-name-direct", "Last name is required.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      isValid = false;
      showError("error-email-direct", "Please enter a valid email address.");
    }

    if (!isValid) {
      return;
    }
    console.log(actualAffectedAreaValue, "actualAffectedAreaValue");
    // Form data
    const formData = {
      calculateType: "Direct Measurement",
      actualAffectedArea: actualAffectedAreaValue,
      unitsAffectedArea: unitsAffectedAreaValue || "cms",
      tubesperValue: totalTubesRequiredDirect,
      tubessuppValue: tubesTotalRequiredDirect,
      dressingsChanged: "Everyday",
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    // Submit data
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          document.getElementById("success-message-direct").innerText =
            "Form submitted successfully!";
        } else {
          document.getElementById("error-message-form-direct").innerText =
            "Error submitting form.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("error-message-form-direct").innerText =
          "Error submitting form.";
      });
  });

function showError(id, message) {
  document.getElementById(id).textContent = message;
}
