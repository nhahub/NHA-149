import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./Button.jsx";
import { Input } from "./Input.jsx";

export function CreateEditContentDialog({
  isOpen,
  onClose,
  onSave,
  content = null,
  isLoading = false,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  
  const [formData, setFormData] = useState({
    type: "faq",
    title: { en: "", ar: "" },
    content: { en: "", ar: "" },
    category: "",
    tags: [],
    featured: false,
    references: [],
    recommendedVideos: [],
    isPublished: false,
  });
  const [currentTag, setCurrentTag] = useState("");
  const [currentReference, setCurrentReference] = useState({ url: "", title: "", description: "" });
  const [currentVideo, setCurrentVideo] = useState({ url: "", title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (content && isOpen) {
      setFormData({
        type: content.type || "faq",
        title: content.title || { en: "", ar: "" },
        content: content.content || { en: "", ar: "" },
        category: content.category || "",
        tags: content.tags || [],
        featured: content.featured || false,
        references: content.references || [],
        recommendedVideos: content.recommendedVideos || [],
        isPublished: content.isPublished || false,
      });
      setThumbnailPreview(content.thumbnailUrl || null);
      setThumbnailFile(null);
    } else if (!content && isOpen) {
      // Reset form for new content
      setFormData({
        type: "faq",
        title: { en: "", ar: "" },
        content: { en: "", ar: "" },
        category: "",
        tags: [],
        featured: false,
        references: [],
        recommendedVideos: [],
        isPublished: false,
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
    }
  }, [content, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "titleEn" || name === "titleAr" || name === "contentEn" || name === "contentAr") {
      const field = name.replace("En", "").replace("Ar", "");
      const lang = name.includes("En") ? "en" : "ar";
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddReference = () => {
    if (currentReference.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        references: [...prev.references, { ...currentReference }],
      }));
      setCurrentReference({ url: "", title: "", description: "" });
    }
  };

  const handleRemoveReference = (index) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideo = () => {
    if (currentVideo.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        recommendedVideos: [...prev.recommendedVideos, { ...currentVideo }],
      }));
      setCurrentVideo({ url: "", title: "", description: "" });
    }
  };

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      recommendedVideos: prev.recommendedVideos.filter((_, i) => i !== index),
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith("image/")) {
        toast.error(t("admin.contentInvalidImageType", { defaultValue: "Please select an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("admin.contentImageTooLarge", { defaultValue: "Image size must be less than 5MB" }));
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.en.trim() || !formData.title.ar.trim()) {
      toast.error(t("admin.contentTitleRequired", { defaultValue: "Title in both languages is required" }));
      return;
    }
    if (!formData.content.en.trim() || !formData.content.ar.trim()) {
      toast.error(t("admin.contentContentRequired", { defaultValue: "Content in both languages is required" }));
      return;
    }
    if (!formData.category) {
      toast.error(t("admin.contentCategoryRequired", { defaultValue: "Category is required" }));
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("type", formData.type);
    submitData.append("title", JSON.stringify(formData.title));
    submitData.append("content", JSON.stringify(formData.content));
    submitData.append("category", formData.category);
    submitData.append("tags", JSON.stringify(formData.tags));
    submitData.append("featured", formData.featured);
    submitData.append("isPublished", formData.isPublished);
    submitData.append("references", JSON.stringify(formData.references));
    if (formData.type === "article") {
      submitData.append("recommendedVideos", JSON.stringify(formData.recommendedVideos));
    }
    
    if (thumbnailFile) {
      submitData.append("thumbnail", thumbnailFile);
    }

    onSave(submitData);
  };

  if (!isOpen) return null;

  const categories = [
    "frontend-development",
    "backend-development",
    "soft-skills",
    "interview-preparation",
    "career-development",
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-secondary-200">
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            {content
              ? t("admin.editContent", { defaultValue: "Edit Content" })
              : t("admin.createContent", { defaultValue: "Create Content" })}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t("admin.contentType", { defaultValue: "Content Type" })}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full h-12 px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="faq">{t("learning.faqs", { defaultValue: "FAQ" })}</option>
              <option value="tip">{t("learning.tips", { defaultValue: "Tip" })}</option>
              <option value="article">{t("learning.articles", { defaultValue: "Article" })}</option>
            </select>
          </div>

          {/* Thumbnail Upload (for articles) */}
          {formData.type === "article" && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("admin.contentThumbnail", { defaultValue: "Thumbnail Image" })}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={isLoading}
                className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
              />
              {thumbnailPreview && (
                <div className="mt-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-w-xs h-auto rounded-lg border border-secondary-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t("learning.categories", { defaultValue: "Category" })}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full h-12 px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{t("admin.selectCategory", { defaultValue: "Select Category" })}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`, { defaultValue: cat })}
                </option>
              ))}
            </select>
          </div>

          {/* Title (Bilingual) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("admin.contentTitleEn", { defaultValue: "Title (English)" })}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="titleEn"
                value={formData.title.en}
                onChange={handleChange}
                required
                disabled={isLoading}
                variant="modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("admin.contentTitleAr", { defaultValue: "Title (Arabic)" })}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="titleAr"
                value={formData.title.ar}
                onChange={handleChange}
                required
                disabled={isLoading}
                variant="modern"
                dir="rtl"
              />
            </div>
          </div>

          {/* Content (Bilingual) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("admin.contentContentEn", { defaultValue: "Content (English)" })}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="contentEn"
                value={formData.content.en}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={8}
                className="w-full px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("admin.contentContentAr", { defaultValue: "Content (Arabic)" })}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="contentAr"
                value={formData.content.ar}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={8}
                className="w-full px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 resize-none"
                dir="rtl"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t("admin.contentTags", { defaultValue: "Tags" })}
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t("admin.contentTagsPlaceholder", { defaultValue: "Add a tag..." })}
                disabled={isLoading}
                variant="modern"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={isLoading || !currentTag.trim()}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      disabled={isLoading}
                      className="hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Videos (for articles only) */}
          {formData.type === "article" && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 flex items-center gap-2">
                <Video className="w-4 h-4" />
                {t("learning.recommendedVideos", { defaultValue: "Recommended Videos" })}
              </label>
              <div className="space-y-3 mb-3">
                <Input
                  value={currentVideo.url}
                  onChange={(e) =>
                    setCurrentVideo({ ...currentVideo, url: e.target.value })
                  }
                  placeholder={t("admin.contentVideoUrl", { defaultValue: "YouTube Video URL" })}
                  disabled={isLoading}
                  variant="modern"
                />
                <Input
                  value={currentVideo.title}
                  onChange={(e) =>
                    setCurrentVideo({ ...currentVideo, title: e.target.value })
                  }
                  placeholder={t("admin.contentVideoTitle", { defaultValue: "Video Title (optional)" })}
                  disabled={isLoading}
                  variant="modern"
                />
                <Input
                  value={currentVideo.description}
                  onChange={(e) =>
                    setCurrentVideo({ ...currentVideo, description: e.target.value })
                  }
                  placeholder={t("admin.contentVideoDescription", { defaultValue: "Description (optional)" })}
                  disabled={isLoading}
                  variant="modern"
                />
                <Button
                  type="button"
                  onClick={handleAddVideo}
                  disabled={isLoading || !currentVideo.url.trim()}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("admin.addVideo", { defaultValue: "Add Video" })}
                </Button>
              </div>
              {formData.recommendedVideos.length > 0 && (
                <div className="space-y-2">
                  {formData.recommendedVideos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-2 p-3 bg-cyan-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          {video.title || video.url}
                        </p>
                        {video.description && (
                          <p className="text-xs text-secondary-600 mt-1">{video.description}</p>
                        )}
                        <p className="text-xs text-cyan-600 mt-1 break-all">{video.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(index)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* References */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t("learning.references", { defaultValue: "References" })}
            </label>
            <div className="space-y-3 mb-3">
              <Input
                value={currentReference.url}
                onChange={(e) =>
                  setCurrentReference({ ...currentReference, url: e.target.value })
                }
                placeholder={t("admin.contentReferenceUrl", { defaultValue: "Reference URL" })}
                disabled={isLoading}
                variant="modern"
              />
              <Input
                value={currentReference.title}
                onChange={(e) =>
                  setCurrentReference({ ...currentReference, title: e.target.value })
                }
                placeholder={t("admin.contentReferenceTitle", { defaultValue: "Title (optional)" })}
                disabled={isLoading}
                variant="modern"
              />
              <Input
                value={currentReference.description}
                onChange={(e) =>
                  setCurrentReference({ ...currentReference, description: e.target.value })
                }
                placeholder={t("admin.contentReferenceDescription", { defaultValue: "Description (optional)" })}
                disabled={isLoading}
                variant="modern"
              />
              <Button
                type="button"
                onClick={handleAddReference}
                disabled={isLoading || !currentReference.url.trim()}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("admin.addReference", { defaultValue: "Add Reference" })}
              </Button>
            </div>
            {formData.references.length > 0 && (
              <div className="space-y-2">
                {formData.references.map((ref, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-2 p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {ref.title || ref.url}
                      </p>
                      {ref.description && (
                        <p className="text-xs text-secondary-600 mt-1">{ref.description}</p>
                      )}
                      <p className="text-xs text-primary-600 mt-1 break-all">{ref.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(index)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured & Published */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                disabled={isLoading}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-secondary-700">
                {t("admin.contentFeatured", { defaultValue: "Featured" })}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                disabled={isLoading}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-secondary-700">
                {t("admin.contentPublished", { defaultValue: "Published" })}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading
                ? t("common.loading")
                : content
                ? t("common.update")
                : t("common.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

