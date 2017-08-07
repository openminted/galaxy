define(["mvc/dataset/states","mvc/dataset/dataset-li","mvc/tag","mvc/annotation","ui/fa-icon-button","mvc/base-mvc","utils/localization"],function(a,b,c,d,e,f,g){"use strict";var h=b.DatasetListItemView,i=h.extend({initialize:function(a){h.prototype.initialize.call(this,a),this.hasUser=a.hasUser,this.purgeAllowed=a.purgeAllowed||!1,this.tagsEditorShown=a.tagsEditorShown||!1,this.annotationEditorShown=a.annotationEditorShown||!1},_renderPrimaryActions:function(){var b=h.prototype._renderPrimaryActions.call(this);return this.model.get("state")===a.NOT_VIEWABLE?b:h.prototype._renderPrimaryActions.call(this).concat([this._renderEditButton(),this._renderDeleteButton()])},_renderEditButton:function(){if(this.model.get("state")===a.DISCARDED||!this.model.get("accessible"))return null;var b=this.model.get("purged"),c=this.model.get("deleted"),d={title:g("Edit attributes"),href:Galaxy.root+"datasets/edit?dataset_id="+this.model.attributes.id,faIcon:"fa-pencil",classes:"edit-btn"};return c||b?(d.disabled=!0,b?d.title=g("Cannot edit attributes of datasets removed from disk"):c&&(d.title=g("Undelete dataset to edit attributes"))):_.contains([a.UPLOAD,a.NEW],this.model.get("state"))&&(d.disabled=!0,d.title=g("This dataset is not yet editable")),e(d)},_renderDeleteButton:function(){if(!this.model.get("accessible"))return null;var a=this,b=this.model.isDeletedOrPurged();return e({title:g(b?"Dataset is already deleted":"Delete"),disabled:b,faIcon:"fa-times",classes:"delete-btn",onclick:function(){a.$el.find(".icon-btn.delete-btn").trigger("mouseout"),a.model.delete()}})},_renderDetails:function(){var b=h.prototype._renderDetails.call(this),c=this.model.get("state");return!this.model.isDeletedOrPurged()&&_.contains([a.OK,a.FAILED_METADATA],c)&&(this._renderTags(b),this._renderAnnotation(b),this._makeDbkeyEditLink(b)),this._setUpBehaviors(b),b},_renderToolHelpButton:function(){var a=this.model.attributes.dataset_id,b=this.model.attributes.creating_job,c=this,d=function(b){var d='<div id="thdiv-'+a+'" class="toolhelp">';b.name&&b.help?(d+="<strong>Tool help for "+b.name+"</strong><hr/>",d+=b.help):d+="<strong>Tool help is unavailable for this dataset.</strong><hr/>",d+="</div>",c.$el.find(".details").append($.parseHTML(d))},f=function(a){$.ajax({url:Galaxy.root+"api/tools/"+a.tool_id+"/build"}).done(function(a){d(a)}).fail(function(){d({})})};return null===Galaxy.user.id?null:e({title:g("Tool Help"),classes:"icon-btn",href:"#",faIcon:"fa-question",onclick:function(){c.$el.find(".toolhelp").length>0?c.$el.find(".toolhelp").toggle():$.ajax({url:Galaxy.root+"api/jobs/"+b}).done(function(a){f(a)}).fail(function(){console.log('Failed at recovering job information from the  Galaxy API for job id "'+b+'".')})}})},_renderSecondaryActions:function(){var b=h.prototype._renderSecondaryActions.call(this);switch(this.model.get("state")){case a.UPLOAD:case a.NOT_VIEWABLE:return b;case a.ERROR:return b.unshift(this._renderErrButton()),b.concat([this._renderRerunButton(),this._renderToolHelpButton()]);case a.OK:case a.FAILED_METADATA:return b.concat([this._renderRerunButton(),this._renderVisualizationsButton(),this._renderToolHelpButton()])}return b.concat([this._renderRerunButton(),this._renderToolHelpButton()])},_renderErrButton:function(){return e({title:g("View or report this error"),href:Galaxy.root+"datasets/error?dataset_id="+this.model.attributes.id,classes:"report-error-btn",target:this.linkTarget,faIcon:"fa-bug"})},_renderRerunButton:function(){var a=this.model.get("creating_job");return this.model.get("rerunnable")?e({title:g("Run this job again"),href:this.model.urls.rerun,classes:"rerun-btn",target:this.linkTarget,faIcon:"fa-refresh",onclick:function(b){b.preventDefault(),Galaxy.router.push("/",{job_id:a})}}):void 0},_renderVisualizationsButton:function(){var a=this.model.get("visualizations");if(this.model.isDeletedOrPurged()||!this.hasUser||!this.model.hasData()||_.isEmpty(a))return null;if(!_.isObject(a[0]))return this.warn("Visualizations have been switched off"),null;var b=$(this.templates.visualizations(a,this));return b.find('[target="galaxy_main"]').attr("target",this.linkTarget),this._addScratchBookFn(b.find(".visualization-link").addBack(".visualization-link")),b},_addScratchBookFn:function(a){a.click(function(a){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.add({title:"Visualization",url:$(this).attr("href")}),a.preventDefault(),a.stopPropagation())})},_renderTags:function(a){if(this.hasUser){var b=this;this.tagsEditor=new c.TagsEditor({model:this.model,el:a.find(".tags-display"),onshowFirstTime:function(){this.render()},onshow:function(){b.tagsEditorShown=!0},onhide:function(){b.tagsEditorShown=!1},$activator:e({title:g("Edit dataset tags"),classes:"tag-btn",faIcon:"fa-tags"}).appendTo(a.find(".actions .right"))}),this.tagsEditorShown&&this.tagsEditor.toggle(!0)}},_renderAnnotation:function(a){if(this.hasUser){var b=this;this.annotationEditor=new d.AnnotationEditor({model:this.model,el:a.find(".annotation-display"),onshowFirstTime:function(){this.render()},onshow:function(){b.annotationEditorShown=!0},onhide:function(){b.annotationEditorShown=!1},$activator:e({title:g("Edit dataset annotation"),classes:"annotate-btn",faIcon:"fa-comment"}).appendTo(a.find(".actions .right"))}),this.annotationEditorShown&&this.annotationEditor.toggle(!0)}},_makeDbkeyEditLink:function(a){if("?"===this.model.get("metadata_dbkey")&&!this.model.isDeletedOrPurged()){var b=$('<a class="value">?</a>').attr("href",this.model.urls.edit).attr("target",this.linkTarget);a.find(".dbkey .value").replaceWith(b)}},events:_.extend(_.clone(h.prototype.events),{"click .undelete-link":"_clickUndeleteLink","click .purge-link":"_clickPurgeLink","click .edit-btn":function(a){this.trigger("edit",this,a)},"click .delete-btn":function(a){this.trigger("delete",this,a)},"click .rerun-btn":function(a){this.trigger("rerun",this,a)},"click .report-err-btn":function(a){this.trigger("report-err",this,a)},"click .visualization-btn":function(a){this.trigger("visualize",this,a)},"click .dbkey a":function(a){this.trigger("edit",this,a)}}),_clickUndeleteLink:function(){return this.model.undelete(),!1},_clickPurgeLink:function(){return confirm(g("This will permanently remove the data in your dataset. Are you sure?"))&&this.model.purge(),!1},toString:function(){var a=this.model?this.model+"":"(no model)";return"HDAEditView("+a+")"}});return i.prototype.templates=function(){var a=_.extend({},h.prototype.templates.warnings,{failed_metadata:f.wrapTemplate(['<% if( dataset.state === "failed_metadata" ){ %>','<div class="failed_metadata-warning warningmessagesmall">',g("An error occurred setting the metadata for this dataset"),'<br /><a href="<%- dataset.urls.edit %>" target="<%- view.linkTarget %>">',g("Set it manually or retry auto-detection"),"</a>","</div>","<% } %>"],"dataset"),deleted:f.wrapTemplate(["<% if( dataset.deleted && !dataset.purged ){ %>",'<div class="deleted-msg warningmessagesmall">',g("This dataset has been deleted"),'<br /><a class="undelete-link" href="javascript:void(0);">',g("Undelete it"),"</a>","<% if( view.purgeAllowed ){ %>",'<br /><a class="purge-link" href="javascript:void(0);">',g("Permanently remove it from disk"),"</a>","<% } %>","</div>","<% } %>"],"dataset")}),b=f.wrapTemplate(["<% if( visualizations.length === 1 ){ %>",'<a class="visualization-link icon-btn" href="<%- visualizations[0].href %>"',' target="<%- visualizations[0].target %>" title="',g("Visualize in"),' <%- visualizations[0].html %>">','<span class="fa fa-bar-chart-o"></span>',"</a>","<% } else { %>",'<div class="visualizations-dropdown dropdown icon-btn">','<a data-toggle="dropdown" title="',g("Visualize"),'">','<span class="fa fa-bar-chart-o"></span>',"</a>",'<ul class="dropdown-menu" role="menu">',"<% _.each( visualizations, function( visualization ){ %>",'<li><a class="visualization-link" href="<%- visualization.href %>"',' target="<%- visualization.target %>">',"<%- visualization.html %>","</a></li>","<% }); %>","</ul>","</div>","<% } %>"],"visualizations");return _.extend({},h.prototype.templates,{warnings:a,visualizations:b})}(),{DatasetListItemEdit:i}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-li-edit.js.map