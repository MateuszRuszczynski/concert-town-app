import django.db.models.deletion
import events.validators
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_reconcile_event_data'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['starts_at', 'id'], 'verbose_name': 'Event', 'verbose_name_plural': 'Events'},
        ),
        migrations.RemoveField(
            model_name='event',
            name='date',
        ),
        migrations.AlterField(
            model_name='event',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='events/', validators=[events.validators.validate_event_image]),
        ),
        migrations.AlterField(
            model_name='event',
            name='organizer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='event',
            name='starts_at',
            field=models.DateTimeField(),
        ),
        migrations.AddConstraint(
            model_name='event',
            constraint=models.CheckConstraint(condition=models.Q(('total_seats__gt', 0)), name='event_positive_capacity'),
        ),
        migrations.AddConstraint(
            model_name='event',
            constraint=models.CheckConstraint(condition=models.Q(('available_seats__lte', models.F('total_seats'))), name='event_available_seats_within_capacity'),
        ),
    ]
