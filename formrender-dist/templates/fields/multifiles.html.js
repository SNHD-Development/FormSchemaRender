define([],function(){var e='<!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload --><div id="<%= name %>_multifiles_wrapper"><div class="row-fluid fileupload-buttonbar"><div class="span10"><input type="file" name="<%= name %>[]" id="<%= name %>_multifiles" class="not_sending"><label for="<%= name %>_multifiles" style="display:inline;"><span class="btn btn-success fileinput-button"><i class="icon-plus icon-white"></i><span>Add File</span></span></label><button type="button" class="btn btn-danger delete"><i class="icon-trash icon-white"></i><span>Remove Files</span></button></div></div><!-- The table listing the files available for upload/download --><table role="presentation" class="table table-striped table-multi-files" id="<%= name %>_multifiles_table"><tbody class="files"></tbody></table></div>';return e});