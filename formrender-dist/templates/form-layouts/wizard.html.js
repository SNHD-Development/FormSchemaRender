define([],function(){var e='<%var _prev = (lang === \'sp\') ? \'Previo\' : \'Previous\',_submit = (lang === \'sp\') ? \'Siguiente Paso\': \'Next\';%><div class="row-fluid"><div class="span12 wizard-view"><!-- Wizard Action --><div class="wizard"><ul class="steps"></ul></div><!-- Wizard Content --><div class="step-content"><%= html %></div><!-- Wizard Control --><div class="form-actions wizard-actions"><button type="button" class="btn btn-large btn-primary btn_prev" disabled="disabled" style="display: none"><i class="icon-arrow-left"></i> <%= _prev %></button><button type="button" class="btn btn-large btn-primary btn_next"><%= _submit %> <i class="icon-arrow-right"></i></button></div></div></div>';return e});