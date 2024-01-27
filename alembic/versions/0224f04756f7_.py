"""

Revision ID: 0224f04756f7
Revises: 
Create Date: 2023-05-08 12:00:44.418552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0224f04756f7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('all_city_weather_data',
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('country', sa.String(), nullable=True),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('lat', sa.String(), nullable=True),
    sa.Column('long', sa.String(), nullable=True),
    sa.Column('PRCP', sa.Float(), nullable=True),
    sa.Column('TAVG', sa.Float(), nullable=True),
    sa.Column('TMAX', sa.Float(), nullable=True),
    sa.Column('TMIN', sa.Float(), nullable=True),
    sa.Column('population', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('submitter_id', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('city', 'date', 'name')
    )
    op.create_index(op.f('ix_all_city_weather_data_date'), 'all_city_weather_data', ['date'], unique=False)
    op.create_index(op.f('ix_all_city_weather_data_name'), 'all_city_weather_data', ['name'], unique=False)
    op.create_table('user',
    sa.Column('date', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(length=256), nullable=True),
    sa.Column('last_name', sa.String(length=256), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('date')
    )
    op.create_index(op.f('ix_user_date'), 'user', ['date'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_date'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_all_city_weather_data_name'), table_name='all_city_weather_data')
    op.drop_index(op.f('ix_all_city_weather_data_date'), table_name='all_city_weather_data')
    op.drop_table('all_city_weather_data')
    # ### end Alembic commands ###
