"""Adding city and state to committee.

Revision ID: ccea236c1362
Revises: f6216325fca0
Create Date: 2020-03-10 23:40:52.364416

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ccea236c1362'
down_revision = 'f6216325fca0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('committee', sa.Column('city', sa.String(length=30), nullable=True))
    op.add_column('committee', sa.Column('state', sa.String(length=2), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('committee', 'state')
    op.drop_column('committee', 'city')
    # ### end Alembic commands ###
