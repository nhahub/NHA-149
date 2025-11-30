import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateSchedule, useUpdateSchedule } from "../../hooks/api";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Input } from "../ui/Input";

export default function ScheduleForm({ schedule, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const isEditMode = !!schedule;

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: 60,
    breakTime: 15,
    title: "",
    description: "",
  });

  // Populate form with schedule data in edit mode
  useEffect(() => {
    if (schedule) {
      setFormData({
        date: schedule.date
          ? new Date(schedule.date).toISOString().split("T")[0]
          : "",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        duration: schedule.duration || 60,
        breakTime: schedule.breakTime || 15,
        title: schedule.title || "",
        description: schedule.description || "",
      });
    }
  }, [schedule]);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "breakTime"
          ? parseInt(value) || 0
          : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.date) {
      setError(t("schedules.errors.dateRequired"));
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError(t("schedules.errors.timeRequired"));
      return;
    }

    if (!formData.title) {
      setError(t("schedules.errors.titleRequired"));
      return;
    }

    try {
      if (isEditMode) {
        await updateSchedule.mutateAsync({
          id: schedule._id,
          data: formData,
        });
      } else {
        await createSchedule.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle>
          {isEditMode
            ? t("schedules.editSchedule")
            : t("schedules.createSchedule")}
        </CardTitle>
        <CardDescription>
          {t("schedules.createScheduleDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {t("schedules.date")} *
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              required
            />
            <p className="text-xs text-secondary-500 mt-1">
              {t("schedules.dateHelp")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("schedules.startTime")} *
              </label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("schedules.endTime")} *
              </label>
              <Input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("schedules.duration")} ({t("common.minutes")}) *
              </label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                max="180"
                step="5"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t("schedules.durationHelp")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("schedules.breakTime")} ({t("common.minutes")})
              </label>
              <Input
                type="number"
                name="breakTime"
                value={formData.breakTime}
                onChange={handleChange}
                min="0"
                max="60"
                step="5"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t("schedules.breakTimeHelp")}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {t("schedules.title")} *
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t("schedules.titlePlaceholder")}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {t("schedules.description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("schedules.descriptionPlaceholder")}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={createSchedule.isPending || updateSchedule.isPending}
            >
              {isEditMode
                ? updateSchedule.isPending
                  ? t("common.updating")
                  : t("schedules.updateSchedule")
                : createSchedule.isPending
                ? t("common.creating")
                : t("schedules.createSchedule")}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createSchedule.isPending || updateSchedule.isPending}
              >
                {t("common.cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

ScheduleForm.propTypes = {
  schedule: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
