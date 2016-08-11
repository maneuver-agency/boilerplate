var $ = require('jquery');

/**
 * @TODO:
 * - Check for field errors.
 * - Take form settings into account. (ajax, ...)
 * - Move honey pot field. => Not neccesary I think cause it's for bots only.
 * - Think about accessibility and people who don't have javascript.
 **/

module.exports = NinjaForm;

function NinjaForm(form_id) {
  var self = this;
  if (!(this instanceof NinjaForm)) return new NinjaForm(form_id);
  self.form_id = form_id;
  self.$sourceForm = $('#ninja_forms_form_' + self.form_id);
}

NinjaForm.prototype.parseIn = function(targetForm) {
  var self = this;
  var $sourceForm = self.$sourceForm;
  var $targetForm = $(targetForm);

  if (!$targetForm.length || !$sourceForm.length) {
    return false;
  }

  // Copy form attributes.
  $.each($sourceForm.get(0).attributes, function(){
    if (this.name == 'action') {
      this.value += ($targetForm.data('anchor') || "#" + $targetForm.attr('id'));
    }
    if (this.name != 'class' && this.name != 'id') {
      $targetForm.attr(this.name, this.value);
    }

  });

  // Move all hidden fields.
  var $hiddens = $sourceForm.find('input[type="hidden"]');
  $targetForm.prepend($hiddens);

  // Copy all fields.
  var $fields = $targetForm.find('[data-field]');
  $fields.each(function(){
    var $t = $(this),
        isInput = $t.is(':input'),
        isLabel = $t.is('label'),
        sourceId = $t.data('field'),
        $sourceEl = $('#ninja_forms_field_' + sourceId + (isLabel ? '_label' : ''));

    if ($sourceEl.length) {
      $.each($sourceEl.get(0).attributes, function(){
        if (this.name !== 'class') {
          if (!$t.get(0).hasAttribute(this.name)) {
            $t.attr(this.name, this.value);
          }
        }
      });

      if (isLabel) {
        $t.html($sourceEl.html())
      }
      if (isInput) {
        switch (this.nodeName.toLowerCase()) {
          case 'select':
            // @TODO: clone all options.
            break;
        }

        // Set initial value if available and if field is blank.
        if ($t.val() == '' && $t.data('value')) {
          $t.val($t.data('value'));
        }
      }
    } else {
      $t.hide();
    }

    // Clean up.
    $t.removeAttr('data-field');
  });

  // Check for response message.
  var $resp = $('#ninja_forms_form_'+ self.form_id +'_response_msg');
  $targetForm.before($resp);

  // Check for no-display.
  if ($sourceForm.hasClass('ninja-forms-no-display')) {
    // The form has been submitted and is set to dissapear after.
    $targetForm.contents().hide();
    $('[data-hide-with-form="'+ self.form_id +'"]').hide();
  }

  // Show form when parsing is done.
  $targetForm.removeClass('invisible');
  $targetForm.trigger('nfParseComplete');

  // Remove original form.
  $sourceForm.remove();
}

// NinjaForm.prototype.on = function(type, selector, callback){
//   var self = this;
//   if (typeof selector === 'undefined' && typeof callback === 'function') {
//     callback = selector;
//     selector = '';
//   }
//   console.debug(type, selector, callback);
//   self.$sourceForm.on(type, selector, callback);
// }
